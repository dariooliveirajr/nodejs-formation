class Processor {

    static process(data){
        var row = data.split("\n");
        var cols = [];

        row.forEach(row => {
            var arr = row.split(",");
            cols.push(arr);
        });
        return cols;
    }

}

module.exports = Processor;