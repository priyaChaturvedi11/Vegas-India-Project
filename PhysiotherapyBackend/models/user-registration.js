class UserRegistration {
    constructor(cnf) {
        this.mobileNumber = cnf.mobileNumber,
            this.title = cnf.title,
            this.yob = cnf.yob,
            this.email = cnf.email,
            this.firstName = cnf.firstName,
            this.lastName = cnf.lastName,
            this.password = cnf.password,
            this.passwordConfirm = cnf.passwordConfirm;
    }
}
export default UserRegistration;
