import React, { Component } from 'react';


class Footer extends Component {
  render() {
    return (

      <footer style={{
        backgroundColor: '#4a7199',
        borderTop: "1px solid black",
        display: "flex",
        justifyContent: "space-around",
        marginTop: "0",
        padding: "0"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: "0.4"
        }}>
          <h3 style={{ textShadow: "2px 2px black", color: "rgb(250,250,230)" }}>TRIPPIN</h3>
          <p>a project by</p>
          <h5 style={{ color: "rgb(200,200,200)", textShadow: "2px 2px black" }}>FAT CAT MAFIA</h5>
        </div>
        <div>

          <div style={{ display: "flex", flexDirection: "column" }}>

            <div style={{
              width: "300px",
              display: "flex",
              height: "80px"
            }}>
              <div style={{
                width: "145px",
                float: "left",
                textAlign: "right",
                lineHeight: "0.2",
                color: "rgb(250,250,230)",
                textShadow: "1px 1px black"
              }}>
                <p>melanie</p>
                <p>david</p>
                <p>sopheak</p>
                <p>xinbei</p>
                <p>thuy</p>
              </div >

              <div style={{
                width: "145px",
                marginLeft: "10px",
                textAlign: "left",
                lineHeight: "0.2",
                color: "rgb(200,200,200)",
                textShadow: "1px 1px black"
              }}>
                <p>goncalves</p>
                <p>li</p>
                <p>ko</p>
                <p>shen</p>
                <p>tran</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
          <h5 style={{
            color: "rgb(250,250,230)",
            textShadow: "0.25px 0.25px black",
            margin: "0"
          }}>SUPPORT</h5>
          <a style={{ textDecoration: "underline", color: "black", fontWeight: "bold" }} href='/FAQ'>FAQ</a>
          <p style={{ margin: " 0 " }}>CONTACT US:</p>
          <p>trippin.app.fatcat@gmail.com</p>
        </div>

        {/* <p>Support <br /> trippinwebapp@gmail.com</p> */}

      </footer>

    );
  }
}

export default Footer;
