import { dbDefaults } from "../config"

declare interface queryParams{
    cols?:Array<string>,
    fields_in?:boolean,
    explude?:boolean,
    page?:number|string
}
declare interface respointInfo{
    methods:Array<"POST"|"GET"|"UPDATE"|"DELETE">,
    params?:queryParams
    
}
declare interface table{
    [key:string]:respointInfo
}

const defaultKeys = Object.keys(dbDefaults);

const users:table = {
    "/":{
        methods:["GET"]
    },
    "/login":{
        methods:["POST"]
    },
    "/register":{
        methods:["POST"]
    },
    "/:id":{
        methods:["GET","POST","UPDATE","DELETE"],
        params:{
            cols:[
                ...defaultKeys
            ]
        }
    },
    
    
}


export const endpointsPreview = {
    "/users": Object.keys(users),
}