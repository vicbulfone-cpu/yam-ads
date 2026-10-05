// Splits a tall screenshot into 1800px-high pieces so they can be viewed: node scripts/split.cjs file.png
const sharp=require("sharp");const f=process.argv[2];const step=Number(process.argv[3]||1800);
sharp(f).metadata().then(async m=>{const H=m.height;const n=Math.ceil(H/step);for(let i=0;i<n;i++){await sharp(f).extract({left:0,top:i*step,width:m.width,height:Math.min(step,H-i*step)}).toFile(f.replace(".png","-p"+(i+1)+".png"))}console.log("parts",n,"height",H)})
