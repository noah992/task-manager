export default class UserProps {
    username?: string | boolean = ''
    fname?: string | boolean = ''
    lname?: string | boolean = ''
    isAdmin?: boolean = false
    email?: string | boolean = ''
    plan?: string | boolean = ''
    claim? = {
        canAccessTask:false
    }
}