function autocomplete(inp, arr) {
    var currentFocus;
    var originalValue = ""; // Para armazenar o valor original digitado pelo usuário
  
    // Adiciona um evento de "focus" para mostrar sugestões quando o campo de entrada é focado
    inp.addEventListener("focus", function(e) {
        var a, b, i, val = this.value;
        closeAllLists(); // Fecha todas as listas abertas de sugestões anteriores
        currentFocus = -1;
        a = document.createElement("DIV"); // Cria um novo elemento DIV
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a); // Adiciona o novo DIV como filho do contêiner de autocomplete
        
        if (!val) { // Se o campo está vazio, mostra os primeiros 2 resultados
          for (i = 0; i < arr.length && i < 2; i++) {
            b = document.createElement("DIV"); // Cria um novo DIV para cada sugestão
            b.innerHTML = arr[i]; // Insere o texto da sugestão no DIV
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"; // Insere um campo hidden com o valor da sugestão
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value; // Define o valor do campo de entrada com o valor da sugestão clicada
                closeAllLists(); // Fecha todas as listas de sugestões
            });
            a.appendChild(b); // Adiciona o DIV de sugestão ao contêiner de sugestões
          }
        } else { // Se há um valor no campo, mostra os resultados correspondentes
          for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              b = document.createElement("DIV"); // Cria um novo DIV para cada sugestão correspondente
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>"; // Negrita as letras correspondentes
              b.innerHTML += arr[i].substr(val.length); // Adiciona o restante do texto da sugestão
              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"; // Insere um campo hidden com o valor da sugestão
              b.addEventListener("click", function(e) {
                  inp.value = this.getElementsByTagName("input")[0].value; // Define o valor do campo de entrada com o valor da sugestão clicada
                  closeAllLists(); // Fecha todas as listas de sugestões
              });
              a.appendChild(b); // Adiciona o DIV de sugestão ao contêiner de sugestões
            }
          }
        }
    });
  
  
    // Adiciona um evento de "input" para mostrar sugestões conforme o usuário digita
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        originalValue = val; // Armazena o valor original digitado pelo usuário
        closeAllLists(); // Fecha todas as listas abertas de sugestões anteriores
        if (!val) { return false; } // Sai da função se o valor do campo de entrada estiver vazio
        currentFocus = -1;
        a = document.createElement("DIV"); // Cria um novo elemento DIV
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a); // Adiciona o novo DIV como filho do contêiner de autocomplete
        var count = 0; // Contador para limitar o número de sugestões exibidas
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV"); // Cria um novo DIV para cada sugestão correspondente
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>"; // Negrita as letras correspondentes
            b.innerHTML += arr[i].substr(val.length); // Adiciona o restante do texto da sugestão
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"; // Insere um campo hidden com o valor da sugestão
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value; // Define o valor do campo de entrada com o valor da sugestão clicada
                closeAllLists(); // Fecha todas as listas de sugestões
            });
            a.appendChild(b); // Adiciona o DIV de sugestão ao contêiner de sugestões
            count++;
            if (count >= 2) break; // Limita o número de sugestões exibidas a 2
          }
        }
    });
  
    // Adiciona um evento de "keydown" para navegação com as teclas de seta
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { // Tecla seta para baixo
          currentFocus++;
          addActive(x); // Adiciona a classe "autocomplete-active" para o item atual
          if (currentFocus > -1 && currentFocus < x.length) {
            inp.value = x[currentFocus].getElementsByTagName("input")[0].value; // Define o valor do campo de entrada com a sugestão ativa
          }
        } else if (e.keyCode == 38) { // Tecla seta para cima
          if (currentFocus > 0) {
            currentFocus--;
            addActive(x); // Adiciona a classe "autocomplete-active" para o item atual
            if (currentFocus > -1 && currentFocus < x.length) {
              inp.value = x[currentFocus].getElementsByTagName("input")[0].value; // Define o valor do campo de entrada com a sugestão ativa
            }
          } else {
            currentFocus = -1;
            inp.value = originalValue; // Restaura o valor original digitado pelo usuário
            removeActive(x); // Remove a classe "autocomplete-active" de todos os itens
          }
        } else if (e.keyCode == 13) { // Tecla Enter
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click(); // Simula um clique no item ativo
          }
        }
    });
  
    // Função para adicionar a classe "autocomplete-active"
    function addActive(x) {
      if (!x) return false;
      removeActive(x); // Remove a classe "autocomplete-active" de todos os itens
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
  
    // Função para remover a classe "autocomplete-active" de todos os itens
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
  
    // Função para fechar todas as listas de sugestões
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
  
    // Fecha todas as listas de sugestões quando alguém clica em qualquer lugar na página
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  
  // Lista de sugestões
  var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  
  // Inicia a função de autocomplete no elemento "myInput" e passa o array "countries" como valores possíveis
  autocomplete(document.getElementById("myInput"), countries);
  