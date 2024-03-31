import React, {useEffect, useState} from "react";
import {Button,Card,Modal} from "react-bootstrap";

import {RepoIcon} from "@primer/octicons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { AlertError, Loading} from "../../../lib/components/controls";
import {cache} from '../../../lib/api';
import {RepositoryCreateForm} from "../../../lib/components/repoCreateForm";
import { useAPIWithPagination} from "../../../lib/hooks/api";
import {Link} from "../../../lib/components/nav";
import { CreateRepositoryButtonProps, CreateRepositoryModalProps} from "../interface/repos_interface";
import {users } from "../../../lib/api/interface/index";
import { useRouter } from "../../../lib/hooks/router";
import { Repository } from "../../../lib/api/interface/Api";
type Order = 'asc' | 'desc';
type SortBy = 'name' | 'created_at';
dayjs.extend(relativeTime);
let rArr:Repository[] = []
export const CreateRepositoryButton: React.FC<CreateRepositoryButtonProps> = ({variant = "success", enabled = false, onClick,word= 'New Repository',style={}}) => {
    return (
        <Button variant={variant} disabled={!enabled} onClick={onClick} style={style}>
            <RepoIcon/> {word}
        </Button>
    );
}

export const CreateRepositoryModal: React.FC<CreateRepositoryModalProps> = ({show,onSubmit, onCancel, inProgress,setShow,setRefresh,refresh}) => {
  const [formValid, setFormValid] = useState(false);

    return (
        <Modal show={show} onHide={onCancel} size="lg">
            <Modal.Body>
                <RepositoryCreateForm
                  id="repository-create-form"
                  onSubmit={onSubmit}
                  setFormValid = {setFormValid}
                />
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}>Cancel</Button>
              <Button variant="primary" type="submit" form="repository-create-form" className="me-2" disabled={!formValid || inProgress} onClick={()=>{setShow(false),setRefresh(refresh)}}>
                { inProgress ? 'Creating...' : 'Create Repository' }
              </Button>
            </Modal.Footer>
        </Modal>
    );
};

export const RepositoryList = ({refresh,setRepoAmount,search,filter='',sortBy,order}:{refresh:boolean,setRepoAmount:React.Dispatch<React.SetStateAction<number>>,search:string,filter:string}) => {
    const user = cache.get('user')
    const router = useRouter()
    const [repoArr,setRepoArr] = useState<Repository[]>([])
    function sortData(data:Repository[], order:Order, sortBy:SortBy) {        
        if (!Array.isArray(data) || data.length === 0) {
            console.error("Invalid data array provided.");
            return [];
        }
        let sortField;
        if (sortBy == "name") {
            sortField = "name" 
        } else if (sortBy == "created_at") {
            sortField = "created_at"; 
        } else {
            console.error("Invalid order parameter. Use 'name' or 'created_at'.");
            return [];
        }
    
        const sortOrder = order === "asc" ? 1 : order === "desc" ? -1 : 0;
        if (sortOrder === 0) {
            console.error("Invalid sortBy parameter. Use 'asc' or 'desc'.");
            return [];
        }
    
        return data.sort((a, b) => {
            const valueA =sortBy=="name"? a[sortField].toLowerCase() : a[sortField];
            const valueB =sortBy=="name"? b[sortField].toLowerCase() : b[sortField];
            if (valueA < valueB) {
                return -sortOrder;
            } else if (valueA > valueB) {
                return sortOrder;
            }
            return 0;
        });
    }
    useEffect(()=>{
        rArr  && sortData(rArr,order,sortBy)
        setRepoArr(rArr)   
    }, [rArr,refresh,search,filter,sortBy,order])

    const Storage = ({storage})=>{
        return(
        <span className="storage">{storage?'public':'private'}</span>
        )
    }
    if(user){
        const {loading, error} = useAPIWithPagination( async() => {
                return  await users.listRepository(user).then((results)=>{
                    if(search && !filter ){
                        results.data.results = results.data.results.filter((item)=>{
                            return item.name.toLowerCase().includes(search.toLowerCase());
                        })
                    }else if(filter && !search){
                        results.data.results = results.data.results.filter((item)=>{
                            return item.visible == (filter == 'Public')
                        })
                    }
                    setRepoAmount(results.data.results.length)
                    rArr=results.data.results
                    return results
                })
        }, [refresh,search,filter]);
        if (loading) return <Loading/>;
        if (error) { 
            return <AlertError error={error}/>;}
            if(repoArr){                
                return (
                    <div>
                        {repoArr.map((repo:Repository)=>{   
                                return(  
                                    <Card key={repo.id}>
                                        <Card.Body>
                                            <h5>
                                                <Link href={{
                                                    pathname: `/repositories/:user/:repoId/objects`,
                                                    params: {repoId: repo.name,user},
                                                }}>
                                                    {repo.name} <Storage storage={repo.visible}/>
                                                </Link>
                                            </h5>
                                            <p>
                                                <small>
                                                    created at <code>{dayjs.unix(Math.floor(repo.created_at)/1000).toISOString()}</code> ({dayjs.unix( Math.floor(repo.created_at)/1000).fromNow()})<br/>
                                                    default branch: <code>{repo.head}</code>,{' '}
                                                    storage namespace: <code>{repo.name}</code>
                                                </small>
                                            </p>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        }
                    </div>
                );}
        }else{
            router.push('/login')
        }
};
