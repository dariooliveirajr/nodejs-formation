const Reader = require("./Reader");
const Processor = require("./Processor")
const Table = require("./Table")
const HtmlParser = require("./HtmlParser");
const Writer = require("./Writer");

var leitor = new Reader();
var escritor = new Writer();

async function main() {
    var dados = await leitor.read("./users.csv");
    var dadosProcessados = Processor.process(dados);
    var usuarios = new Table(dadosProcessados);
    var html = await HtmlParser.parse(usuarios);
    
    escritor.write(Date.now()+".html",html);
}

main();