var User = {
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    mobileNumber: String,
    title: String,
    firstName: String,
    lastName: String,
    yob: Number,
    password: String,
    passwordConfirm: String
};

module.exports = User;