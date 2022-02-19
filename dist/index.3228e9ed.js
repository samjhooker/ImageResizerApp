const fileInput=document.querySelector("#upload"),colorPicker=document.querySelector("#color-picker"),widthInput=document.querySelector("#width-input"),heightInput=document.querySelector("#height-input"),exportButton=document.querySelector("#export-button"),canvas=document.querySelector("#canvas"),context=canvas.getContext("2d");let imgToResize=null;canvasWidth=700,canvasHeight=300,backgroundColor="black",scale=1,xOffset=0,yOffset=0;var mouseStartX,mouseStartY,canvasOffsetX,canvasOffsetY,isDragging=!1,isImageLoaded=!1;function calcOffsetOfCanvas(){var e=canvas.getBoundingClientRect();canvasOffsetX=e.left,canvasOffsetY=e.top}function downloadImage(){console.log("download image");let e=canvas.toDataURL("image/jpeg"),a=new XMLHttpRequest;a.responseType="blob",a.onload=function(){let e=document.createElement("a");e.href=window.URL.createObjectURL(a.response),e.download="ImageResizerDownload.jpg",e.style.display="none",document.body.appendChild(e),e.click(),e.remove()},a.open("GET",e),a.send()}function fileToDataUri(e){return new Promise((a=>{const n=new FileReader;n.addEventListener("load",(()=>{a(n.result)})),n.readAsDataURL(e)}))}function renderCanvas(){if(canvas.width=canvasWidth,canvas.height=canvasHeight,context.fillStyle=backgroundColor,context.fillRect(0,0,canvas.width,canvas.height),imgToResize){const e=imgToResize.width,a=imgToResize.height,n=canvasWidth,t=n/(e/a);context.drawImage(imgToResize,xOffset,yOffset,n*scale,t*scale)}}function handleMouseDown(e){e.preventDefault(),e.stopPropagation(),mouseStartX=parseInt(e.clientX-canvasOffsetX),mouseStartY=parseInt(e.clientY-canvasOffsetY),isDragging=!0}function handleMouseUp(e){isDragging&&(e.preventDefault(),e.stopPropagation(),isDragging=!1)}function handleMouseOut(e){isDragging&&(e.preventDefault(),e.stopPropagation(),isDragging=!1)}function handleMouseMove(e){if(!isDragging&&!imgToResize)return;e.preventDefault(),e.stopPropagation();let a=parseInt(e.clientX-canvasOffsetX),n=parseInt(e.clientY-canvasOffsetY);xOffset+=a-mouseStartX,yOffset+=n-mouseStartY,renderCanvas(),mouseStartX=a,mouseStartY=n}function handleScroll(e){e.preventDefault(),e.stopPropagation(),imgToResize&&(e.deltaY>0?scale+=.01:scale-=.01,renderCanvas())}document.addEventListener("DOMContentLoaded",(function(){calcOffsetOfCanvas(),window.onscroll=function(e){calcOffsetOfCanvas()},window.onresize=function(e){calcOffsetOfCanvas()},canvas.onresize=function(e){calcOffsetOfCanvas()},renderCanvas(),canvas.onmousedown=handleMouseDown,canvas.onmousemove=handleMouseMove,canvas.onmouseup=handleMouseUp,canvas.onmouseout=handleMouseOut,canvas.onmousewheel=handleScroll})),colorPicker.addEventListener("change",(async e=>{backgroundColor=e.target.value,renderCanvas()})),heightInput.addEventListener("change",(async e=>{canvasHeight=e.target.value,renderCanvas()})),widthInput.addEventListener("change",(async e=>{canvasWidth=e.target.value,renderCanvas()})),fileInput.addEventListener("change",(async e=>{const[a]=fileInput.files;return imgToResize=document.querySelector("#imgToResize"),imgToResize.src=await fileToDataUri(a),imgToResize.addEventListener("load",(()=>{renderCanvas()})),!1})),document.addEventListener("keydown",(function(e){switch(e.key){case"ArrowLeft":xOffset-=3;break;case"ArrowRight":xOffset+=3;break;case"ArrowUp":yOffset-=3;break;case"ArrowDown":yOffset+=3;break;case"=":scale+=.01;break;case"-":scale-=.01}renderCanvas()}));
//# sourceMappingURL=index.3228e9ed.js.map
