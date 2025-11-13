import dotenv from "dotenv";
import AT from "africastalking";

dotenv.config()

const AT_API_KEY = process.env.AT_API_KEY

const credentials = {
    apiKey: AT_API_KEY,         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};

const AfricasTalking = AT(credentials);

// Initialize a service e.g. SMS
const sms = AfricasTalking.SMS

export const sendMessage = async (req, res) => {
    const {to, message, from} = req.body;

    const options = {
        to: to,
        message: message,
        from: from
    }

    sms.send(options)
        .then( response => {
            console.log("success: ", response);
            return res.json(response);
        })
        .catch( error => {
            console.log("error", error);
            return res.status(500).json({ message: error });
    });
}
