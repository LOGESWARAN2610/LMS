import React, { useEffect } from "react";
import setTheme from "../../Sub-Component/setTheme";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import nodeurl from "../../../nodeServer.json";
import { useState } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { CompactPicker } from "react-color";

export default function Settings() {
  const [profileName, setProfileName] = useState("");
  const [pickerColor, setPickerColor] = useState({
    Primary: "",
    Secondary: "",
  });
  const [oldColor, setoldColor] = useState({ Primary: "", Secondary: "" });
  const alert = useAlert();
  const navigate = useNavigate();
  const Navigate = (path) => {
    navigate(path);
  };
  //1f456e", "151e3d", "0589a0", "444791", "f48225", "428bca", "911844
  const Color = [
    { Primary: "#444791", Secondary: "#fff" },
    { Primary: "#151e3d", Secondary: "#fff" },
    { Primary: "#0589a0", Secondary: "#fff" },
    { Primary: "#f48225", Secondary: "#fff" },
    { Primary: "#428bca", Secondary: "#fff" },

    { Primary: "#911844", Secondary: "#fff" },
    { Primary: "#0d3560", Secondary: "#fff" },
    { Primary: "#6fbb80", Secondary: "#fff" },
    { Primary: "#e30b5d", Secondary: "#fff" },
    { Primary: "#111", Secondary: "#fff" },

    { Primary: "#82ade2", Secondary: "#111" },
    { Primary: "#4fb8c0", Secondary: "#111" },
    { Primary: "#ffcf05", Secondary: "#111" },
    { Primary: "#00bfff", Secondary: "#0c090a" },
    { Primary: "#673ab7", Secondary: "#fff" },

    { Primary: "#ff6f00", Secondary: "#111" },
    { Primary: "#f8bbd0", Secondary: "#111" },
    { Primary: "#8bc34a", Secondary: "#111" },
    { Primary: "#0288d1", Secondary: "#111" },
    { Primary: "#FF69B4", Secondary: "#111" },

    { Primary: "#FF6347", Secondary: "#111" },
    { Primary: "#BDB76B", Secondary: "#111" },
    { Primary: "#6A5ACD", Secondary: "#111" },
    { Primary: "#008080", Secondary: "#111" },
    { Primary: "#F08080", Secondary: "#111" },
    { Primary: "#151e3d", Secondary: "#fe9200" },
  ];
  useEffect(() => {
    axios
      .post(nodeurl["nodeurl"], {
        query:
          "Select ISNULL(ProfileName,'') ProfileName,ISNULL(Theme,'') Theme FROM EmployeeDetails WHERE EmpId=" +
          localStorage["EmpId"],
      })
      .then((result) => {
        if (result.data[0][0]["ProfileName"] !== "")
          setProfileName(result.data[0][0]["ProfileName"]);
        else setProfileName(localStorage["Gender"] + ".png");

        let color = result.data[0][0]["Theme"];
        if (color !== "") color = color.split(",");
        setoldColor({ Primary: color[0], Secondary: color[1] });
      });
    setTheme();
  }, []);
  const imageHandler = (e) => {
    const file = e.target.files[0];
    debugger;
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "9cQKFT3dYKrOnF8CEDKO4DTaSKxrHUD4JK8f3tT3");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
    myHeaders.append("Access-Control-Allow-Methods", "POST,PATCH,OPTIONS");
    myHeaders.append("x-api-key", "9cQKFT3dYKrOnF8CEDKO4DTaSKxrHUD4JK8f3tT3");
    var formdata = new FormData();
    formdata.append(
      "file",
      file,
      "C:/Users/Admin/Downloads/Paystub_12-22-21_211675.pdf"
    );
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    fetch(
      "https://2y31yfw1hd.execute-api.us-east-1.amazonaws.com/prod/extract-paystub-pdf?x-api-key=9cQKFT3dYKrOnF8CEDKO4DTaSKxrHUD4JK8f3tT3",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        alert("Vandhutan da");
        console.log(result);
      })
      .catch((error) => console.log("error ==========> ", error)); // var myHeaders = new Headers();
    e.target.value = null;
    return;

    const fileExt = file.name
      .substr(file.name.indexOf("."), file.name.length)
      .toLocaleLowerCase();
    const imgType = [".png", ".jpeg", ".jpg"];
    if (imgType.indexOf(fileExt) === -1) {
      let err = "Use any of the file type " + imgType.join(" / ");
      alert.error(err);
      return;
    }

    const fileName =
      "Profile" +
      Math.floor(10000 + Math.random() * 9000) +
      "_" +
      localStorage["EmpId"] +
      fileExt;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        axios
          .post(nodeurl["nodeurl"] + "Delete", { EmpId: localStorage["EmpId"] })
          .then((result) => {
            // console.log("Image deleted");
          });
        axios
          .post(nodeurl["nodeurl"] + "Upload", {
            img: reader.result,
            fileName: fileName,
            EmpId: localStorage["EmpId"],
          })
          .then((result) => {
            axios
              .post(nodeurl["nodeurl"], {
                query:
                  "Update EmployeeDetails SET ProfileName='" +
                  fileName +
                  "' WHERE EmpId=" +
                  localStorage["EmpId"],
              })
              .then((result) => {
                // console.log("Image Uploaded");
                Navigate("/Settings");
                setProfileName(fileName);
              });
          });
      }
    };
    reader.readAsDataURL(file);
  };
  const imagedeleteHandler = () => {
    axios
      .post(nodeurl["nodeurl"] + "Delete", { EmpId: localStorage["EmpId"] })
      .then((result) => {
        //  console.log("Image deleted");
        let fileName = localStorage["Gender"] + ".png";
        axios
          .post(nodeurl["nodeurl"], {
            query:
              "Update EmployeeDetails SET ProfileName='" +
              fileName +
              "' WHERE EmpId=" +
              localStorage["EmpId"],
          })
          .then((result) => {
            Navigate("/Settings");
            setProfileName(fileName);
          });
      });
  };
  // const handelBuildStatusPolling = () => {
  //     console.log('Build Status Polling Started.');
  //     const statusPolling = setInterval(() => {
  //         axios.post(nodeurl['nodeurl'], { query: 'SELECT TOP 1 Commend,[Current Status] as [Status],isSucceed FROM BuildStatus ORDER BY Id DESC' }).then(result => {
  //             if (result.data[0]['length'] === 0) return;
  //             let Commend = result.data[0][0]['Commend']
  //                 , Status = result.data[0][0]['Status']
  //                 , isSucceed = result.data[0][0]['isSucceed']
  //             console.log(Commend + ' ==> ' + Status + ' ==> ' + (isSucceed ? 'Pass' : 'Failed'));
  //             // axios.post(nodeurl['nodeurl'], { query: 'TRUNCATE TABLE BuildStatus' }).then(result => {
  //             // });
  //             if (!isSucceed || Commend === 'Completed') {
  //                 if (Commend !== 'Error') {
  //                     console.log('dsh')
  //                     //   axios.post(nodeurl['nodeurl'] + 'restartIIS').then(result => {
  //                     clearInterval(statusPolling);
  //                     console.log('Build Status Polling Ended.');
  //                     // });
  //                 }
  //                 else {
  //                     clearInterval(statusPolling);
  //                     console.log('Build Status Polling Ended.');
  //                 }
  //             }
  //         });
  //     }, 3000);
  // }
  // const handelBuild = () => {
  //     console.log('Build Started...');
  //     axios.post(nodeurl['nodeurl'] + 'initateBuild', { cmd: '../../Build/InitiateBuild.js' }).then(result => {
  //         handelBuildStatusPolling();
  //     });
  // }
  const handelColorClick = (event) => {
    const color = Color[parseInt(event.currentTarget.attributes.index.value)];
    localStorage.setItem("BgColor", color["Primary"]);
    localStorage.setItem("Color", color["Secondary"]);
    setTheme();
  };
  const handelClick = () => {
    const color = localStorage["BgColor"] + "," + localStorage["Color"];
    axios
      .post(nodeurl["nodeurl"], {
        query:
          "update EmployeeDetails set Theme='" +
          color +
          "' where Empid=" +
          localStorage["EmpId"],
      })
      .then((result) => {
        alert.success("Theme Saved Successfully.");
        setoldColor({
          Primary: localStorage["BgColor"],
          Secondary: localStorage["Color"],
        });
      });
  };
  const getDesignation = () => {
    // <span className="profession" style={{  top: '12%', left: '4%', fontSize: '20px' }}>{localStorage["Designation"]}</span>

    return (
      <>
        <div style={{ padding: "0 15px" }}>
          <span className="profession">
            {localStorage["Designation"].split("-")[0]}
          </span>
          <br />
          {localStorage["Designation"].split("-")[1] && (
            <span className="profession">
              {localStorage["Designation"].split("-")[1]}
            </span>
          )}
        </div>
      </>
    );
  };
  return (
    <>
      <div className="page" id="Settings">
        <div
          className="container container_1"
          style={{ width: "45%", minWidth: "590px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                textAlign: "center",
                display: "inline-block",
                margin: "25px 20px",
              }}
            >
              <h1 className="heading">{localStorage["Name"]}</h1>
              {getDesignation()}
            </div>
            <div
              className="Img-profile"
              style={{ display: "inline-block", margin: "0 25px" }}
            >
              <img
                src={
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  "/images/" +
                  profileName
                }
                alt=""
                id="img"
                className="img"
              />
              <div className="img-up">
                <label className="image-upload choosephoto" htmlFor="input">
                  <FontAwesomeIcon icon={faUpload} className="icon" />
                </label>
                <label
                  className="image-upload choosephoto"
                  onClick={imagedeleteHandler}
                >
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </label>
              </div>
              <input
                type="file"
                name="image-upload"
                id="input"
                onChange={imageHandler}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                margin: "0 20px 20px 20px",
                borderTop: "1px solid",
                paddingTop: "5px",
              }}
            >
              {Color.map((color, index) => {
                return (
                  <div key={index} className="colorPaletteWrapper">
                    <div
                      className="colorPalette col-sm"
                      onClick={handelColorClick}
                      index={index}
                      style={{
                        backgroundColor: color["Primary"],
                        border: "2px solid" + color["Primary"],
                      }}
                    >
                      <div className="primary"></div>
                      <div
                        className="secondary"
                        style={{ backgroundColor: color["Secondary"] }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              <div
                style={{ display: "inline-block", margin: "5px 10px 3px 10px" }}
              >
                <label className="customColorLabel">Primary Color</label>
                <CompactPicker
                  label="Primary Color"
                  color={pickerColor["Primary"]}
                  onChangeComplete={(color) => {
                    localStorage.setItem("BgColor", color.hex);
                    setTheme();
                    setPickerColor({ ...pickerColor, Primary: color.hex });
                  }}
                />
              </div>
              <div
                style={{ display: "inline-block", margin: "5px 10px 3px 10px" }}
              >
                <label className="customColorLabel">Secondary Color</label>
                <CompactPicker
                  label="Secondary Color"
                  color={pickerColor["Secondary"]}
                  onChangeComplete={(color) => {
                    localStorage.setItem("Color", color.hex);
                    setTheme();
                    setPickerColor({ ...pickerColor, Secondary: color.hex });
                  }}
                />
              </div>
              <div>
                <button
                  id="applybtn"
                  className="btn"
                  style={{ float: "right" }}
                  onClick={handelClick}
                >
                  Apply
                </button>
                <button
                  id="applybtn"
                  className="btn"
                  style={{ float: "right" }}
                  onClick={() => {
                    localStorage.setItem("BgColor", oldColor["Primary"]);
                    localStorage.setItem("Color", oldColor["Secondary"]);
                    setTheme();
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <button className="btn"
                    onClick={handelBuild}
                >Initiate Build</button> */}

        {/* <div className="container container_2" style={{ minWidth: '400px', textAlign: 'center' }}> */}

        {/* </div> */}
      </div>
    </>
  );
}
