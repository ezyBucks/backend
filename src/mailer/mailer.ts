import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // Need to move to dotenv
        user: '',
        pass: ''
    }
});
