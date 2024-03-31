import React, {useEffect, useRef, useState} from "react";
import {ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, XIcon} from "@primer/octicons-react";
import {cache} from '../../api';
import {Nav, Badge,Form,Button,Alert,Overlay,Popover } from "react-bootstrap";
import {RefTypeBranch, RefTypeCommit, RefTypeTag} from "../../../constants";
import { CommitListProps, RefDropdownProps, RefEntryProps, RefSelectorProps, ref, RepoPaginatorProps, ResponseProps } from "../interface/comp_interface";
import { Commit } from "../../../lib/api/interface/Api"
import { repos } from "../../api/interface";
import { useRouter } from "../../hooks/router";


const RefSelector:React.FC<RefSelectorProps> = ({ repo, selected, selectRef, withWorkspace, withTags, amount = 300 }) => {
    // used for ref pagination
    const [pagination, setPagination] = useState({after: "", prefix: "", amount});
    const [refList, setRefs] = useState<{loading: boolean, payload:ResponseProps | null, error:Error | null}>({loading: true, payload: null, error: null});
    const [refType, setRefType] = useState(selected && selected.type || RefTypeBranch)
    const user = cache.get('user')
    useEffect(() => {
        setRefs({loading: true, payload: null, error: null});
        const fetchRefs = async () => {
            try {
                let response;
                if (refType === RefTypeTag && repo.name) {
                    response = await repos.listTags(user, repo.name);
                } else {
                    if(repo.name)
                        await repos.listBranches(user,repo.name).then(  (data)=>{
                        response =   data.data
                });
                
                }
                    setRefs({loading: false, payload: response, error: null});
            } catch (error) {
                setRefs({loading: false, payload: null, error: error as Error});
            }
        };
        fetchRefs();
    }, [refType, repo, pagination])

    // used for commit listing
    const initialCommitList = {branch: selected, commits: null, loading: false};
    
    const [commitList, setCommitList] = useState(initialCommitList);


    const form = (
        <div className="ref-filter-form">
            <Form onSubmit={e => { e.preventDefault(); }}>
                <Form.Control type="text" placeholder={refType === RefTypeTag ? "Filter tags" : "Filter branches"} onChange={(e)=> {
                    setPagination({
                        amount,
                        after: "",
                        prefix: e.target.value
                    })
                }}/>
            </Form>
        </div>
    );
    const refTypeNav = withTags && <Nav variant="tabs" onSelect={setRefType} activeKey={refType} className="mt-2">
        <Nav.Item>
            <Nav.Link eventKey={"branch"}>Branches</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link eventKey={"tag"}>Tags</Nav.Link>
        </Nav.Item>
    </Nav>

    if (refList.loading) {
        return  (
            <div className="ref-selector">
                {form}
                {refTypeNav}
                <p>Loading...</p>
            </div>
        );
    }

    if (refList.error) {
        return  (
            <div className="ref-selector">
                {form}
                {refTypeNav}
                <Alert variant="danger">{refList.error.message}</Alert>
            </div>
        );
    }

    if (commitList.commits !== null) {
        return (
            <CommitList
                withWorkspace={withWorkspace}
                commits={commitList.commits}
                branch={commitList.branch.name as string}
                selectRef={selectRef}
                reset={() => {
                    setCommitList(initialCommitList);
                }}/>
        )}
                
    const results = refList.payload ? refList.payload.data ? refList.payload.data.results : refList.payload.results : '';
    
                
    return (
        <div className="ref-selector">
            {form}
            {refTypeNav}
            <div className="ref-scroller">
                {(results && results.length > 0) ? (
                    <>
                        <ul className="list-group ref-list">
                            {results.map(namedRef => (
                                <RefEntry repo={repo} namedRef={namedRef.name} selectRef={selectRef} refType={refType}
                                />
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-center mt-3"><small>No references found</small></p>
                )}

            </div>
        </div>
    );
};

const CommitList:React.FC<CommitListProps> = ({ commits, selectRef, reset, branch, withWorkspace }) => {
    const getMessage = (commit:Commit) => {
        if (!commit.message) {
            return 'repository epoch';
        }

        if (commit.message.length > 60) {
            return commit.message.substr(0, 40) + '...';
        }

        return commit.message;
    };

    return (
        <div className="ref-selector">
            <h5>{branch}</h5>
            <div className="ref-scroller">
                <ul className="list-group ref-list">
                    {(withWorkspace) ? (
                        <li className="list-group-item" key={branch}>
                            <Button variant="link" onClick={() => {
                                selectRef({id: branch, type: RefTypeBranch});
                            }}><em>{branch}{'\''}s Workspace (uncommitted changes)</em></Button>
                        </li>
                    ) : (<span/>)}
                    {commits.map(commit => (
                        <li className="list-group-item" key={commit.id}>
                            <Button variant="link" onClick={() => {
                                selectRef({id: commit.id, type: RefTypeCommit});
                            }}>{getMessage(commit)} </Button>
                            <div className="actions">
                                <Badge variant="light">{commit.id.substr(0, 12)}</Badge>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="ref-paginator">
                    <Button variant="link" size="sm" onClick={reset}>Back</Button>
                </p>
            </div>
        </div>
    );
};

const RefEntry:React.FC<RefEntryProps> = ({repo, namedRef, refType, selectRef, selected}) => {
  
    return (
        <li className="list-group-item" key={namedRef}>
        {(!!selected && namedRef === selected.name) ?
                <strong>{namedRef}</strong> :
                <Button variant="link" onClick={() => {
                    selectRef({id: namedRef, type: refType});
                }}>{namedRef}</Button>
}
            <div className="actions">
               {(refType === RefTypeBranch && namedRef === repo.head) ? (<Badge variant="info">Default</Badge>) : <span/>}
                    <Button onClick={() => {
                    selectRef({id: namedRef, type: refType});
                }} size="sm" variant="link">
                        <ChevronRightIcon/>
                    </Button>
            </div>
        </li>
    );
};


const RefDropdown:React.FC<RefDropdownProps> = ({ repo, selected, selectRef, onCancel, variant="light", prefix = '', emptyText = '', withCommits = true, withWorkspace = true, withTags = true,commitId}) => {

    const [show, setShow] = useState(false);
    const target = useRef(null);


    const popover = (
        <Overlay target={target.current} show={show} placement="bottom" rootClose={true} onHide={() => setShow(false)}>
            <Popover className="ref-popover">
                <Popover.Body>
                    <RefSelector
                        repo={repo}
                        withCommits={withCommits}
                        withWorkspace={withWorkspace}
                        withTags={withTags}
                        selected={selected}
                        selectRef={(ref) => {
                            selectRef(ref);
                            setShow(false);
                        }}/>
                </Popover.Body>
            </Popover>
        </Overlay>
    );

    const cancelButton = (!!onCancel && !!selected) ? (<Button onClick={() => {
        setShow(false);
        onCancel();
    }} variant={variant}><XIcon/></Button>) : (<span/>);

    if (!selected) {
        return (
            <>
                <Button ref={target} variant={variant} onClick={()=> { setShow(!show) }}>
                    {emptyText} {show ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                </Button>
                {cancelButton}
                {popover}
            </>
        );
    }


    const title = commitId? 'commit' : selected.type;    
    const content = commitId? commitId : selected.name;    
    return (
        <>
            <Button ref={target} variant={variant} onClick={()=> { setShow(!show) }}>
                {title} <strong>{content}</strong> {show ? <ChevronUpIcon/> : <ChevronDownIcon/>}
            </Button>
            {cancelButton}
            {popover}
        </>
    );
};

export default RefDropdown;
