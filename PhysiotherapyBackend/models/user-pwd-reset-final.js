class UserPasswordResetFinal {
    constructor(cnf) {
        this.email = cnf.email;
        this.newPassword = cnf.newPassword,
            this.newPasswordConfirm = cnf.newPasswordConfirm,
            this.passwordResetHash = cnf.passwordResetHash;
    }
}
export default UserPasswordResetFinal;
