    function id(idElemento){
        return document.getElementById(idElemento);
    };
    function mescla_objetos(velho,novo){
        for(chave in novo){
            velho[chave] = novo[chave];
        }
    };
    function GraficoLinha(canvas,opcoes_usuario){
        var g, altura,largura,altura_util,largura_util,deltaX,deltaY;
        function constroi(){
            opcoes = {
                'cores':['red','blue','green','orange'],
                'margem_esquerda':10,
                'divisoes':0,
                'espessura_linha':3
            };
            mescla_objetos(opcoes,opcoes_usuario);
            g = canvas.getContext('2d');
            largura = canvas.offsetWidth;
            altura = canvas.offsetHeight;
            largura_util = largura - opcoes.margem_esquerda - 10;
            altura_util = altura - 20;
            desenha_eixos();
        };
        function desenha_eixos(){
            g.strokeStyle = 'black';
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(opcoes.margem_esquerda,altura - 5);
            g.lineTo(opcoes.margem_esquerda,10);
            g.moveTo(opcoes.margem_esquerda - 5,altura - 10);
            g.lineTo(largura - 10,altura - 10);
            g.stroke();
            g.beginPath();
            g.moveTo(opcoes.margem_esquerda,10);
            g.lineTo(opcoes.margem_esquerda + 3,17);
            g.lineTo(opcoes.margem_esquerda - 3,17);
            g.fill();            
            g.beginPath();
            g.moveTo(largura - 10,altura - 10);
            g.lineTo(largura - 17,altura - 13);
            g.lineTo(largura - 17,altura - 7);
            g.fill();
        };
        function zera(){
            g.clearRect(0,0,largura,altura);
            desenha_eixos();
        };
        function setDados(vdados){
            dados = vdados;
            zera();
            plota();
        };
        function plota(){
            var x,y, deltaX,deltaY;
            g.save();
            g.translate(opcoes.margem_esquerda,altura - 10);
            var maior = 0;
            var menor = Math.pow(2,53);
            for(var i=0;i<dados.length;i++){                
                for(var j=0;j<dados[i].dados.length;j++){
                    if(dados[i].dados[j] < menor){
                        menor = dados[i].dados[j];
                    }
                    if(dados[i].dados[j] > maior){
                        maior = dados[i].dados[j];
                    }
                }
            }
            deltaY = maior - menor;
            var intervalo = deltaY/opcoes.divisoes;
            g.strokeStyle = 'rgba(0,0,0,0.25)';
            if(opcoes.divisoes){
                g.fillText(Math.round(menor),5-opcoes.margem_esquerda,3);
                for(var i=0;i<opcoes.divisoes;i++){
                    g.beginPath();
                    y = Math.round((i+1)*intervalo*altura_util/deltaY);
                    g.fillText(Math.round((i+1)*intervalo + menor),5-opcoes.margem_esquerda,-y+3);
                    g.lineTo(0,-y);
                    g.lineTo(largura_util,-y);
                    g.stroke();
                }                
            }
            g.lineWidth = opcoes.espessura_linha;
            g.lineCap = 'round';
            g.lineJoin = 'round';
            for(var i=0;i<dados.length;i++){
                deltaX = dados[i].dados.length;                
                g.strokeStyle = opcoes.cores[i%opcoes.cores.length];
                g.beginPath();
                for(j=0;j<dados[i].dados.length;j++){
                    x = Math.round(j*largura_util/(deltaX-1));
                    y = Math.round((dados[i].dados[j] - menor)*altura_util/deltaY);
                    x = isNaN(x)?0:x;
                    y = isNaN(y)?(altura_util/2):y;
                    g.lineTo(x,-y);
                }
                g.stroke();                
            }
            g.restore();
        };
        constroi();
        this.zera = zera;
        this.setDados = setDados;
    };
    var opt = {
                            'cores':['red','blue','green','orange'],        
                            'margem_esquerda': 35,
                            'divisoes': 10,
                            'espessura_linha': 5
                        };
    var g = new GraficoLinha(id('grafico'),opt);    
    var dados = [
                             {'legenda':'linha1','dados':[100,500,200,600,400]},
                             {'legenda':'linha2','dados':[500,600,800,150,200]},
                             {'legenda':'linha3','dados':[100,217,618,900,755]}
                            ];
    g.setDados(dados);
    g.plota();