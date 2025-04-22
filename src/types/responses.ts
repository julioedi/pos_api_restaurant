export declare interface ErrorResponse{
    code:number,
    request:string,
    data:any,
    error:boolean,
    error_message:string | null,
}


export declare interface userTokenResponse{
    key:string,
    token:string,
    data: {
        ID:number,
        title:string,
        slug:string,
        status:number,
        featured_id:number,
        email:string,
        role:null|Array<number>
    }
}