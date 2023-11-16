require("dotenv").config();

// const url = process.env.SOAP_URL;
// "X-API-KEY": process.env.SOAP_API_KEY,

const headers = {
  "Content-Type": "text/xml;charset=UTF-8",
  "X-API-KEY": "RestClient",
};

const topup_soap_template = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
<Body>
    <topupPoint xmlns="http://service.example.org/">
        <arg0 xmlns="">%d</arg0>
        <arg1 xmlns="">%d</arg1>
    </topupPoint>
</Body>
</Envelope>`;

const topup = {
  url: "http://localhost:8081/topup",
  headers: headers,
  template: topup_soap_template
};

const buyProduct_soap_template = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
<Body>
    <buyProduct xmlns="http://service.example.org/">
        <arg0 xmlns="">%d</arg0>
        <arg1 xmlns="">%d</arg1>
        <arg2 xmlns="">%d</arg2>
        <arg3 xmlns="">%d</arg3>
    </buyProduct>
</Body>
</Envelope>`;

const buyProduct = {
  url: "http://localhost:8081/buyProduct",
  headers: headers,
  template: buyProduct_soap_template
};

const getHistory_soap_template = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
<Body>
    <getHistory xmlns="http://service.example.org/">
        <arg0 xmlns="">%d</arg0>
    </getHistory>
</Body>
</Envelope>`;

const getHistory = {
  url: "http://localhost:8081/getHistory",
  headers: headers,
  template: getHistory_soap_template
};

module.exports = { topup, buyProduct, getHistory };


