const URL_GAS = "https://script.google.com/macros/s/AKfycbyOZObCnKnnbwwuwTO8CULGvh1-c9hiUqAhBs15N3ceMYaFQaiHtTQWGJgugbodinP6/exec";

/* =====================
   UI
===================== */
function verPaso(n){
  document.querySelectorAll('.paso').forEach(p=>p.classList.remove('activo'));
  document.getElementById('paso'+n).classList.add('activo');
  window.scrollTo(0,0);
}

function loader(on,text="Procesando..."){
  const l = document.getElementById('loader');
  const t = document.getElementById('loader-texto');

  if(t) t.innerText = text;
  l.style.display = on ? 'flex' : 'none';
}

/* =====================
   MAYÚSCULAS
===================== */
document.addEventListener("input",e=>{
  if(e.target.name && e.target.name !== "correo"){
    e.target.value = e.target.value.toUpperCase();
  }
});

/* =====================
   VALIDAR CÉDULA ECUADOR
===================== */
function validarCedulaReal(ced){
  if(!/^\d{10}$/.test(ced)) return false;

  let suma = 0;

  for(let i=0;i<9;i++){
    let n = parseInt(ced[i]);
    if(i % 2 === 0){
      n = n * 2;
      if(n > 9) n -= 9;
    }
    suma += n;
  }

  const verificador = (10 - (suma % 10)) % 10;

  return verificador === parseInt(ced[9]);
}

/* =====================
   VALIDAR EN SERVIDOR
===================== */
async function validarCedulaServidor(c){
  try{

    if(!validarCedulaReal(c)){
      return {ok:false,msg:"Cédula inválida"};
    }

    const r = await fetch(`${URL_GAS}?action=validarRegistro&cedula=${c}`);

    if(!r.ok){
      return {ok:false,msg:"Error de servidor"};
    }

    const d = await r.json();

    if(d.cedulaExiste){
      return {ok:false,msg:"Ya registrado"};
    }

    return {ok:true};

  }catch(err){
    console.log(err);
    return {ok:false,msg:"Sin conexión al servidor"};
  }
}

/* =====================
   ARMADURA (NOMBRE + DORSAL)
===================== */
async function cargarArmadura(){
  try{

    nombreCamiseta.innerHTML = "";
    dorsal.innerHTML = "";

    // nombres
    if(n1.value){
      nombreCamiseta.add(new Option(n1.value, n1.value));
    }
    if(n2.value){
      nombreCamiseta.add(new Option(n2.value, n2.value));
    }

    // dorsales
    const r = await fetch(`${URL_GAS}?action=getDorsales`);

    const usados = await r.json();

    for(let i=1;i<=99;i++){
      if(!usados.includes(String(i))){
        dorsal.add(new Option(i, i));
      }
    }

  }catch(err){
    console.log(err);
  }
}

/* =====================
   ENVIAR REGISTRO
===================== */
async function enviarRegistro(){

  try{

    const data = new URLSearchParams(new FormData(formRegistro));

    const r = await fetch(URL_GAS,{
      method:"POST",
      body:data
    });

    return true;

  }catch(err){
    console.log(err);
    return false;
  }
}
