import { useEffect, useRef } from "react";
import { Canvas, Rect, Image } from "fabric";

function CanvasEditor({ template, history }) {

  const canvasRef = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {

    canvas.current = new Canvas(canvasRef.current,{
      width:1000,
      height:500,
      backgroundColor:"#fff"
    });

    return () => canvas.current.dispose();

  },[]);

  useEffect(()=>{

    if(!template) return;

    canvas.current.clear();

    template.frames.forEach(frame => {

      const rect = new Rect({
        left: frame.left,
        top: frame.top,
        width: frame.width,
        height: frame.height,
        stroke: "#888",
        fill: "transparent",
        strokeDashArray:[5,5],
        selectable:false
      });

      canvas.current.add(rect);

    });

  },[template]);

  const addImage = (file)=>{

    const reader = new FileReader();

    reader.onload=(event)=>{

      Image.fromURL(event.target.result).then(img=>{

        img.scaleToWidth(200);
        img.left = 200;
        img.top = 150;

        canvas.current.add(img);

        history.push(canvas.current.toJSON());

      });

    };

    reader.readAsDataURL(file);

  };

  return (
    <div className="canvasArea">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default CanvasEditor;