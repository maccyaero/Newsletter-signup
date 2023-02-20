const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { json } = require("body-parser");
const app = express();
const https = require('https');
const MailChimpKey = "";
const AudienceID = "";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/signup.html");
  });

app.post('/',function(req,res){
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;

    // console.log(firstName, lastName, email)
    // Mailchimp API receives Post in this format:
    var data = { 
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    //Converting JS Object to JSON object to send it to MailChimp
    var jsonData = JSON.stringify(data);
    // Data is ready now, time to make a POST request to Mailchimp 
    const url = "https://us21.api.mailchimp.com/3.0/lists/"+AudienceID;
    const options = {
        method:"POST",
        auth: "waliabbas:"+MailChimpKey,
    };
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data))

        })
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }

    });
    request.write(jsonData);
    request.end();
});
app.listen(3000, function(){
    console.log("Server Running on port 3000.")
})

