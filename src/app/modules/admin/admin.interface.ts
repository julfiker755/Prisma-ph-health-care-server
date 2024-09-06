export type IAdminFilterRequest={
    name?:string | undefined
    email?:string | undefined
    contactNumber?:string | undefined
    search?:string | undefined

}
export type IPaginationOptions={
    page?:number,
    limit?:number,
    sortBy?:string | undefined,
    sortOrder?:string | undefined,
}