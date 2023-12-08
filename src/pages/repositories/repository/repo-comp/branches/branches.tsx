import React, {useMemo, useRef, useState} from "react";

import {
    GitBranchIcon,
    LinkIcon,
    PackageIcon,
    TrashIcon
} from "@primer/octicons-react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import {branches} from "../../../../../lib/api";

import {
    ActionGroup,
    ActionsBar, ClipboardButton,
    AlertError, LinkButton,
    Loading, PrefixSearchWidget, RefreshButton
} from "../../../../../lib/components/controls";
import {RepositoryPageLayout} from "../../../../../lib/components/repository/layout";
import {useRefs} from "../../../../../lib/hooks/repo";
import {useAPIWithPagination} from "../../../../../lib/hooks/api";
import {Paginator} from "../../../../../lib/components/pagination";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import RefDropdown from "../../../../../lib/components/repository/refDropdown";
import Badge from "react-bootstrap/Badge";
import {ConfirmationButton} from "../../../../../lib/components/modals";
import Alert from "react-bootstrap/Alert";
import {Link} from "../../../../../lib/components/nav";
import {useRouter} from "../../../../../lib/hooks/router";
import {RepoError} from "../error/error";
import { BranchListProps, BranchWidgetParms, CreateBranchButtonProps } from "../../../interface/repo_interface";
import { Branch } from "../../../../../lib/api/interface";

const ImportBranchName = 'import-from-inventory';


const BranchWidget = ({ repo, branch, onDelete }:BranchWidgetParms) => {

    const buttonVariant = "outline-dark";
    const isDefault = repo.default_branch === branch.id;
    let deleteMsg = (
        <>
            Are you sure you wish to delete branch <strong>{branch.id}</strong> ?
        </>
    );
    if (branch.id === ImportBranchName) {
        deleteMsg = (
            <>
                <p>{deleteMsg}</p>
                <Alert variant="warning"><strong>Warning</strong> this is a system branch used for importing data to JiaoziFS</Alert>
            </>
        );
    }

    return (
        <ListGroup.Item>
            <div className="clearfix">
                <div className="float-start">
                    <h6>
                        <Link href={{
                            pathname: '/repositories/:repoId/objects',
                            params: {repoId: repo.id},
                            query: {ref: branch.id}
                        }}>
                            {branch.id}
                        </Link>

                        {isDefault &&
                        <>
                            {' '}
                            <Badge>Default</Badge>
                        </>}
                    </h6>
                </div>


                <div className="float-end">
                    {!isDefault &&
                    <ButtonGroup className="commit-actions">
                        <ConfirmationButton
                                variant="outline-danger"
                                disabled={isDefault}
                                msg={deleteMsg}
                                tooltip="delete branch"
                                onConfirm={() => {
                                    branches.delete(repo.id, branch.id)
                                        .catch(err => alert(err))
                                        .then(() => onDelete(branch.id));
                                } } 
                                modalVariant={""} 
                                size={"sm"}                        >
                            <TrashIcon/>
                        </ConfirmationButton>
                    </ButtonGroup>
                    }

                    <ButtonGroup className="branch-actions ms-2">
                        <LinkButton
                            href={{
                                pathname: '/repositories/:repoId/commits/:commitId',
                                params:{repoId: repo.id, commitId: branch.commit_id},
                            }}
                            buttonVariant="outline-dark"
                            tooltip="View referenced commit">
                            {branch.commit_id.substr(0, 12)}
                        </LinkButton>
                        <ClipboardButton variant={buttonVariant} text={branch.id} tooltip="Copy ID to clipboard" onSuccess={undefined} onError={undefined}/>
                        <ClipboardButton variant={buttonVariant} text={`jzfs://${repo.id}/${branch.id}`} tooltip="Copy URI to clipboard" icon={<LinkIcon />} onSuccess={undefined} onError={undefined}/>
                        <ClipboardButton variant={buttonVariant} text={`s3://${repo.id}/${branch.id}`} tooltip="Copy S3 URI to clipboard" icon={<PackageIcon />} onSuccess={undefined} onError={undefined}/>
                    </ButtonGroup>
                </div>
            </div>
        </ListGroup.Item>
    );
};


const CreateBranchButton: React.FC<CreateBranchButtonProps> = ({ repo, variant = "success", onCreate = null, children }) => {
    const [show, setShow] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<Error | boolean | null>(null);
    const textRef = useRef<HTMLInputElement>(null);
    const defaultBranch = useMemo(
        () => ({ id: repo.default_branch, type: "branch"}),
        [repo.default_branch]);
    const [selectedBranch, setSelectedBranch] = useState(defaultBranch);


    const hide = () => {
        if (disabled) return;
        setShow(false);
    };

    const display = () => {
        setShow(true);
    };

    const onSubmit = async () => {
        setDisabled(true);
        const branchId = textRef.current ? textRef.current.value : '';
        const sourceRef = selectedBranch.id;

        try {
            await branches.create(repo.id, branchId, sourceRef);
            setError(false);
            setDisabled(false);
            setShow(false);
            if(onCreate) {
            onCreate();}
        } catch (err) {
            setError(err as Error);
            setDisabled(false);
        } 
    };

    return (
        <>
            <Modal show={show} onHide={hide} enforceFocus={false}>
                <Modal.Header closeButton>
                    Create Branch
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={(e) => {
                        onSubmit();
                        e.preventDefault();
                    }}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Control type="text" placeholder="Branch Name" name="text" ref={textRef}/>
                        </Form.Group>
                        <Form.Group controlId="source" className="mb-3">
                            <RefDropdown
                                repo={repo}
                                emptyText={'Select Source Branch'}
                                prefix={'From '}
                                selected={selectedBranch}
                                selectRef={(refId:string) => {
                                    setSelectedBranch({ id: refId, type: "branch" });
                                } }
                                withCommits={true}
                                withWorkspace={false} onCancel={undefined}/>
                        </Form.Group>
                    </Form>

                    {!!error && <AlertError error={error}/>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={disabled} onClick={hide}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={onSubmit} disabled={disabled}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button variant={variant} onClick={display}>{children}</Button>
        </>
    );
};


const BranchList: React.FC<BranchListProps> = ({ repo, prefix, after, onPaginate }) => {
    const router = useRouter()
    const [refresh, setRefresh] = useState(true);
    const { results, error, loading, nextPage } = useAPIWithPagination(async () => {
        return branches.list(repo.id, prefix, after);
    }, [repo.id, refresh, prefix, after]);

    const doRefresh = () =>  setRefresh(!refresh);

    let content;

    if (loading) content = <Loading/>;
    else if (error) content = <AlertError error={error}/>;
    else content = (
        <>
            <Card>
                <ListGroup variant="flush">
                    {results.map((branch:Branch) => (
                        <BranchWidget key={branch.id} repo={repo} branch={branch} onDelete={doRefresh}/>
                    ))}
                </ListGroup>
            </Card>
            <Paginator onPaginate={onPaginate} nextPage={nextPage} after={after}/>
        </>
    );

    return (
        <div className="mb-5">
            <ActionsBar>
                <ActionGroup orientation="right">

                    <PrefixSearchWidget
                        defaultValue={router.query.prefix}
                        text="Find branch"
                        onFilter={prefix => {
                            const query = {prefix};
                            router.push({pathname: '/repositories/:repoId/branches', params: {repoId: repo.id}, query});
                        }}/>

                    <RefreshButton onClick={doRefresh}/>

                    <CreateBranchButton repo={repo} variant="success" onCreate={doRefresh}>
                        <GitBranchIcon/> Create Branch
                    </CreateBranchButton>

                </ActionGroup>
            </ActionsBar>
            {content}
        </div>
    );
};

const BranchesContainer:React.FC = () => {
    const router = useRouter()
    const { repo, loading, error } = useRefs();
    const { after } = router.query;
    const routerPfx = (router.query.prefix) ? router.query.prefix : "";

    if (loading) return <Loading/>;
    if (error) return <RepoError error={error}/>;

    return (
        <BranchList
            repo={repo}
            after={(after) ? after : ""}
            prefix={routerPfx}
            onPaginate={after => {
                const query = {after,prefix:''};
                if (router.query.prefix) query.prefix = router.query.prefix;
                router.push({pathname: '/repositories/:repoId/branches', params: {repoId: repo.id}, query});
            }}/>
    );
};


const RepositoryBranchesPage = () => {
    return (
            <RepositoryPageLayout activePage={'branches'}>
                <BranchesContainer/>
            </RepositoryPageLayout>
    )
}

export default RepositoryBranchesPage;