function Cadastro() {
	var usuario = document.getElementsByName('usuario')[0].value;
	
	usuario=usuario.toLowerCase();
	
	var senha= document.getElementsByName('senha')[0].value;
	senha=senha.toLowerCase();
	var csenha = document.getElementsByName('csenha')[0].value;
	csenha=csenha.toLowerCase();
	
		if(csenha=="" || senha=="" || usuario==""){
		//	alert("dados não podem ficar vazios!");//
			swal("Erro!", "Dados não podem ficar vazios!", "error");
			
		}
	
		else if (senha != csenha) {
			//alert("Senhas diferentes!");//
			swal("Atenção!", "Senhas diferentes!", "warning");
			
			
		}
	}

//form.onsubmit = function(){}     
//() => {}


//form.onsubmit = Cadastro;
