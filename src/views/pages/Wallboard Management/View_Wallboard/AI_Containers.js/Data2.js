import { useEffect, useState } from "react";
import MainCard from "ui-component/cards/MainCard";

 const Data2 = () => {
  const stringText = `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`;
  const [lineString, setLineString] = useState([]);

  const getString = (str) => {
    let oldString = "";
    let myStr = "";
    for (let i = 0; i < str.length; i++) {
      myStr += str[i];
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      context.font = getComputedStyle(document.body).font;
      const textWidth = context.measureText(myStr).width;

      // width of an - is 8px so use container width - 8px
      if (textWidth > 392) {
        let newStr = myStr;
        oldString += myStr;

        if (
          newStr[newStr.length - 1] !== " " &&
          str[oldString.length] !== " " &&
          str[oldString.length] !== "."
        ) {
          newStr += "-";
        }
        setLineString((prev) => [...prev, newStr]);
        myStr = "";
      }
    }
  };

  useEffect(() => {
    getString(stringText);
  }, [stringText]);

  return (
    <MainCard title="Test">
    <div style={{ display: "flex" }}>
      <div
        className="App"
        style={{
          border: "1px solid red",
          marginInline: 50,
          width: 400,
          textAlign: "left",
          hyphens: "auto", // Enable hyphenation
          overflowWrap: "break-word",
        }}
      >
        {stringText}
      </div>
      <div
        style={{
          width: "fit-content",
          border: "1px solid green",
        }}
      >
        {lineString.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
    </MainCard>
  );
};


export default Data2