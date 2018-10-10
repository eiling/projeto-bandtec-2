## Referência Rápida
### Linguagens utilizadas e guias de estilo
* Java 11 - https://google.github.io/styleguide/javaguide.html
* HTML5 e CSS3 - https://google.github.io/styleguide/htmlcssguide.html
* JavaScript (ES6) - https://google.github.io/styleguide/jsguide.html
* Python 3.7 e Django 2.1 - https://github.com/google/styleguide/blob/gh-pages/pyguide.md
* JSON e YAML
* SQL (Azure SQL Server)
* Markdown

### Segurança
Crie uma pasta chamada _secrets_ na raíz do repositório para guardar arquivos com senhas e afins.

### _Committing_
* Antes de começar a fazer as mudanças, atualize o repositório local
   * __git pull__
* Crie um novo branch local
   * __git checkout -b BRANCH-NAME__
* Edite e faça o _commit_
* Faça o _push_ do branch local para o repositório remoto
  * __git push -u origin BRANCH-NAME__
* Crie a _pull request_ no GitHub

### Criação do ambiente virtual Python
* No diretório _webapp_, execute o comando __python -m venv venv__
* Ative o ambiente executando o arquivo _activate_ para o seu sistema operacional (_.bat_ para Windows), localizado no diretório venv/Scripts
* Para desativar o ambiente, execute respectivo o arquivo _deactivate_

### Links úteis
* Documentação Java 10: https://docs.oracle.com/javase/10/
* Documentação Python 3.7: https://docs.python.org/3/
* Tutorial Gradle: https://guides.gradle.org/building-java-applications/
* Tutorial Django: https://docs.djangoproject.com/en/2.1/intro/
* GitHub Markdown: https://guides.github.com/features/mastering-markdown/
* Documentação MS T-SQL: https://docs.microsoft.com/en-us/sql/t-sql/language-reference?view=sql-server-2017
* MDN web docs: https://developer.mozilla.org/en-US/
  * for...of loop JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
* Documentação Git: https://git-scm.com/docs
* Repositório Maven: https://mvnrepository.com/
* Documentação PySNMP: http://snmplabs.com/pysnmp/docs/tutorial.html
* Documentação SNMP4J: https://www.snmp4j.org/html/documentation.html
