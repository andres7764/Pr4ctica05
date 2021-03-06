import utils from "./utils";

let urlImg            = "img/image03.jpg",
    matrizPuzzle      = [], //Para guardar la matriz de la respuesta...
    matrizDesorganiza = [];
let click = 0;
const valorCorte = 100;//El valor del corte que se hará...
utils.creaPuzzle(urlImg, valorCorte, ({error = false, data}) =>
{
    if(!error)
    {
        matrizPuzzle = JSON.parse(JSON.stringify(data));
        matrizDesorganiza = JSON.parse(JSON.stringify(data));
        //Crear clase del fondo...
        utils.createClass(".fondo", `background: url(${urlImg});
                                     background-repeat: none;
                                     font-family: Arial;
                                     color: white;
                                     text-shadow: 1px 1px 1px black;`);
        imprimePuzzle(data);
    }
});

//Para el estilo de las celdas...
let estiloCelda = ({fila, columna, ocupado}) =>
{
    //margin-right: 5px;
    let style = `width: ${valorCorte}px;
                 height: ${valorCorte}px;
                 display: inline-block;
                 border: 1px solid black;`;
    let clase = "";
    if(ocupado)
    {
        style += `background-position: -${fila}px -${columna}px;
                  cursor: pointer;
                  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.42);`;
        clase = "class = 'fondo'";
    }
    return {style, clase};
};

//Para imprimir el Puzzle...
let imprimePuzzle = (data) =>
{
    window.global = data;
    //utils.accesoDOM("puzzle").style.height = utils.accesoDOM("puzzle").style.width = `${(valorCorte * data.length) + (data.length * 5)}px`;
    utils.accesoDOM("puzzle").style.height = utils.accesoDOM("puzzle").style.width = `${(valorCorte * data.length) + (data.length * 2)}px`;
    let cortes = "";
    for(let veces = 1; veces <= 2; veces++)
    {
        for(let i = 0; i < data.length; i++)
        {
            if(veces === 1)
            {
                cortes += "<div class = 'niveles'>";
            }
            for(let c = 0; c < data.length; c++)
            {
                if(veces === 1)
                {
                    let {style, clase} = estiloCelda({
                        fila    : data[i][c].fila,
                        columna : data[i][c].columna,
                        ocupado : data[i][c].ocupado
                    });
                    let numero = data[i][c].ocupado ? data[i][c].cont : "&nbsp;";
                    cortes += `<div id = '${i}_${c}' ${clase} style = '${style}'>${numero}</div>`;
                }
                else
                {
                    //Para los Listeners...
                    utils.accesoDOM(`${i}_${c}`).addEventListener('click', event =>
                    {
                        let ind = event.target.id.split("_");
                        presionaPieza(Number(ind[0]), Number(ind[1]));
                    });

                }
            }
            if(veces === 1)
            {
                cortes += "</div>";
            }
        }
        if(veces === 1)
        {
            utils.accesoDOM("puzzle").innerHTML = cortes;
        }
    }
};

let presionaPieza = (fila, columna) =>
{
    click++;
    //Saber que el elemento presionado, esté ocupado...
    if(matrizDesorganiza[fila][columna].ocupado)
    {
        let replaceSpace = utils.accesoDOM(`${fila}_${columna}`);
        //Revisar si se tiene lugar para mover...
        let direcciones = {
                                izquierda   : [0, -1],
                                arriba      : [-1, 0],
                                derecha     : [0, 1],
                                abajo       : [1, 0]
                          };
        for (let i in direcciones)
        {
            let posBusca = {
                                fila    : fila + direcciones[i][0],
                                columna : columna + direcciones[i][1]
                           };
            let enPosicion = posBusca.fila >= 0 && posBusca.fila < matrizPuzzle.length &&
                             posBusca.columna >= 0 && posBusca.columna < matrizPuzzle.length;
            if(enPosicion)
            {
                
                //Saber si existe espacio...
               console.log(`${i} ocupado: ${matrizDesorganiza[posBusca.fila][posBusca.columna].ocupado}`);
                if (matrizDesorganiza[posBusca.fila][posBusca.columna].ocupado === false) {
                    matrizDesorganiza[fila][columna].ocupado = false;
                    matrizDesorganiza[fila][columna].cont = 0;
                    for (let i = 1; i <= 2; i++) {
                        if(i == 1) {
                            let blackSpace = utils.accesoDOM(`${[posBusca.fila]}_${[posBusca.columna]}`);
                            matrizDesorganiza[posBusca.fila][posBusca.columna].ocupado = true; 
                            matrizDesorganiza[posBusca.fila][posBusca.columna].cont = replaceSpace.innerText; 
                            let {style, clase} = estiloCelda({
                                                                    fila    : parseInt(replaceSpace.style.backgroundPositionX) * -1,
                                                                    columna : parseInt(replaceSpace.style.backgroundPositionY) * -1,
                                                                    ocupado : matrizDesorganiza[posBusca.fila][posBusca.columna].ocupado
                                                            });
                            blackSpace.classList.add("fondo");
                            blackSpace.setAttribute("style", style);
                            blackSpace.innerHTML = replaceSpace.innerText;
                        } else {
                            let {style, clase} = estiloCelda({
                                                                    fila    : parseInt(replaceSpace.backgroundPositionX)* -1,
                                                                    columna : parseInt(replaceSpace.backgroundPositionY)* -1,
                                                                    ocupado : matrizDesorganiza[fila][columna].ocupado
                                                            });
                            replaceSpace.innerText = ".";
                            replaceSpace.classList.remove("fondo");
                            replaceSpace.setAttribute("style", style);
                        }
                    }
                }
            }
        }
    }
    utils.accesoDOM("clicks").innerHTML = `<h3><font  color='blue'>Cantidad de clicks: ${click}</font></h3>`;
};

//Para desorganizar el Puzlle..
let desorganizaPuzzle = () =>
{
    matrizDesorganiza = [];
    const valorMaximo = Math.pow(matrizPuzzle.length, 2);
    let desorganiza       = [],
        fila              = 0,
        columna           = 0,
        existe            = false,
        cont              = 0;
    do
    {
        //Obtener los valores aleatorio...
        existe = false;
        fila = Math.floor(Math.random() * matrizPuzzle.length);
        columna = Math.floor(Math.random() * matrizPuzzle.length);
        if(desorganiza.length !== 0)
        {
            for(let i = 0; i < desorganiza.length; i++)
            {
                if(desorganiza[i].fila === fila && desorganiza[i].columna === columna)
                {
                    existe = true;
                    break;
                }
            }
        }
        if(!existe)
        {
            desorganiza.push({fila, columna});
            if(desorganiza.length === valorMaximo)
            {
                break;
            }
        }
    }while(1);
    //Para crear la Matriz desorganizada...
    for(let i = 0; i < matrizPuzzle.length; i++)
    {
        matrizDesorganiza.push([]);
        for(let c = 0; c < matrizPuzzle.length; c++)
        {
            let posicion = desorganiza[cont];
            matrizDesorganiza[i][c] = JSON.parse(JSON.stringify(matrizPuzzle[posicion.fila][posicion.columna]));
            cont++;
        }
    }
    imprimePuzzle(matrizDesorganiza);
};

//Para los botones...
utils.accesoDOM("desorganiza").addEventListener('click', event =>
{
    desorganizaPuzzle();
});

utils.accesoDOM("resuelve").addEventListener('click', event =>
{
    matrizDesorganiza = JSON.parse(JSON.stringify(matrizPuzzle));
    imprimePuzzle(matrizPuzzle);
});

utils.accesoDOM("comprueba").addEventListener('click', event =>
{
    let cont = 0;
    for(let i = 0; i < matrizPuzzle.length; i++)
    {
        for(let c = 0; c < matrizPuzzle.length; c++)
        {
            if(matrizPuzzle[i][c].cont !== matrizDesorganiza[i][c].cont) {
                break;
            } else {
                cont++;
            }
        }
    }
    (cont === matrizPuzzle.length) ? utils.accesoDOM("message").innerHTML = "<h3><font  color='green'>Correcto</font></h3>" : utils.accesoDOM("message").innerHTML = `<h3><font  color='red'>Sigue intentando, validas ${cont} </font></h3>`;
});