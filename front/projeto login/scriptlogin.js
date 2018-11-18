function login() {
	var usuario = document.getElementsByName('usuario')[0].value;
	usuario=usuario.toLowerCase();
	
	var senha= document.getElementsByName('senha')[0].value;
	senha=senha.toLowerCase();
	
	
		if(usuario=="" || senha==""){
		//	alert("dados não podem ficar vazios!");//
			swal("Erro!", "Dados não podem ficar vazios!", "error");
			
		}
	
	
	}