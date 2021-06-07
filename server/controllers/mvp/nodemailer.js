const {User, Property} = require("../../models");
const nodemailer = require('nodemailer');
let ownerEmail = "muhammadihsan076@gmail.com";
const senderEmail = "simpleCoders@outlook.com";
const senderPassword = "maestro82"; // outlook password
const fs = require("fs");
const {promisify} = require("util");
const handlebars = require("handlebars");

async function sendMail(subject, text, to = ownerEmail) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
            user: senderEmail,
            pass: senderPassword,
            },
        });

        const message = {
            from: `report sender <${senderEmail}>`,
            to,
            subject,
            text: subject,
            html: text,
            attachments: [{
                filename: 'Report.pdf',
                path: __dirname + "/Report.pdf"
            }]
        };

        transporter.sendMail(message, () => {
            console.log(message);
        });
        } catch (e) {
            console.log(e)
        }
}

const readFile = promisify(fs.readFile);

function convertToRupiah(angka)
{
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}

// sendMailTenant(`Payment reminder`, "", tenantEmail, tenantName, userData, roomData);
async function sendMailTenant(subject, text, to = ownerEmail, tenantName, userData, roomData) {
    try {
        let html = await readFile(__dirname + "/mangkosan-email.html", "utf8");
        let template = handlebars.compile(html);
        let userProp = userData.Property;
      
        let data = {
            tenantName,
            ownerName: userData.name,
            bankAccount: userData.bankAccount,
            propertyName: userProp.name,
            propertyAddress: userProp.address,
            propertyPhone: userProp.phone,
            roomPrice: convertToRupiah(roomData.price),
        };
        let htmlToSend = template(data);

        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
            user: senderEmail,
            pass: senderPassword,
            },
        });

        const message = {
            from: `report sender <${senderEmail}>`,
            to,
            subject,
            text: subject,
            html: htmlToSend,
        };

        transporter.sendMail(message, () => {
            console.log(message);
        });
        } catch (e) {
            // console.log(e)
        }
}



module.exports = {
    sendMail, sendMailTenant, convertToRupiah
};