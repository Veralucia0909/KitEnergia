import "./Avatar.css";

function Avatar({ nome = "U", imagem }) {
    const primeirasLetras = nome
    .split(" ")
    .map((item) => item[0])
    .join("")
    .toUpperCase();

  return (
    <div className="avatar__root">
      {imagem ? <img src={imagem} alt={nome} /> : primeirasLetras}
    </div>
  );
}

export default Avatar;
