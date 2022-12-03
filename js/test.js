var ddd = {
  2: { p: [105, 95, 90, 40] },
  3: { p: [225, 0, 90, 40], rn: 4 },
  4: { p: [225, 55, 90, 40], ln: 3, rn: 15 },
  7: { p: [52.5, -65, 90, 40] },
  9: { p: [0, 95, 90, 40] },
  15: { p: [225, 110, 90, 40], ln: 4 },
  9999: { p: [52.5, 15, 90, 40] },
}; //[2,7,9]

//  result{"2":{"p":[120,100,120,40],"yy":[100,100],"rn":3},
//  "3":{"p":[120,150,120,40],"yy":[150,150],"ln":2,"rn":4},
//  "4":{"p":[120,200,120,40],"yy":[200,200],"ln":3},
//  "7":{"p":[120,0,120,40],"yy":[0,0]},
//  "9":{"p":[120,50,120,40],"yy":[50,50],"rn":2},
//  "15":{"p":[120,250,120,40],"yy":[250,250],"ln":4},
//  "9999":{"p":[0,125,120,40],"yy":[0,250]}}

var rrr = { 2: { pids: [9999] }, 9999: { pids: [2] } };

// {
//   "base": {
//       "orientation": 3,
//       "levelSeparation": 30,
//       "mixedHierarchyNodesSeparation": 15,
//       "assistantSeparation": 100,
//       "subtreeSeparation": 20,
//       "siblingSeparation": 15,
//       "layout": 0,
//       "columns": 10,
//       "collapse": {},
//       "partnerNodeSeparation": 15
//   },
//   "children-group": {
//       "orientation": 3,
//       "levelSeparation": 30,
//       "mixedHierarchyNodesSeparation": 15,
//       "assistantSeparation": 100,
//       "subtreeSeparation": 20,
//       "siblingSeparation": 7,
//       "layout": 0,
//       "columns": 1,
//       "collapse": {},
//       "partnerNodeSeparation": 15
//   }
// }

function findnodePointer(node, d) {
  var totalnodes = d.n.length;
  for (let i = 0; i < totalnodes; i++) {
    if (d.n[i].p[0] == node) {
      return i;
    }
  }
  return totalnodes; //stands for not found
}

function findwife(node, wife, r) {
  if(r[node]==undefined)
  return false;
  var totalwives = r[node].pids.length; 
  for (let i = 0; i < totalwives; i++) {
    if (r[node].pids[i] == wife) {
      return true;
    }
  }
  return false;
}

function findchilds(
  parent,
  rrr,
  nodePointer,
  node,
  d,
  level,
  y,
  result,
  smallbrother,
  bigbrother
) {
  let haswife=false;
  let siblingSeparation = 15;
  let levelSeparation=30;
  var heightbox=40;
  var widebox=90;
  var totalnodes = d.n.length;
  if (nodePointer >= totalnodes) return result;
  //   d.n[nodePointer].p[1] = level;
  let maxy = y;
  let miny = y;
  if (d.n[nodePointer].hasOwnProperty("c")) {
    for (let j = 0; j < d.n[nodePointer].c.length; j++) {
      let bb = totalnodes;
      let sb = totalnodes;
      if (j > 0) {
        sb = d.n[nodePointer].c[j - 1];
      }
      if (j + 1 < d.n[nodePointer].c.length) {
        bb = d.n[nodePointer].c[j + 1];
      }
      let childnodePointer = findnodePointer(d.n[nodePointer].c[j], d);
      if (childnodePointer >= totalnodes) return;
      result = findchilds(
        node,
        rrr,
        childnodePointer,
        d.n[nodePointer].c[j],
        d,
        level + 1,
        y,
        result,
        sb,
        bb
      ); 
      var iswife = findwife(node, d.n[nodePointer].c[j], rrr);
      if (!iswife) {
        maxy = result[d.n[nodePointer].c[j]].yy[1];
        //maxy = d.n[childnodePointer].y[2];
        if (j + 1 < d.n[nodePointer].c.length) {
          //y = d.n[childnodePointer].y[2] + siblingSeparation + heightbox;
          y = result[d.n[nodePointer].c[j]].yy[1] + siblingSeparation + heightbox;
        }
      }else{
        haswife=true;
      }
      //max 4 wives
      //if more than 2nd wives x= width=90+ partnerNodeSeparation=15, then husband x=(2*width=90+ siblingSeparation)/2
      // husband-wife sep y=80 = height=40 +
    }
  }
  let mstring = {};
  var iswife = findwife(node, parent, rrr);
  let compensation=0;
  if(haswife) compensation=heightbox;

  if (!iswife) {
    //   let mstring= {"treewidth":[miny + (maxy - miny) / 2, miny, maxy]};
    if (bigbrother < totalnodes && smallbrother < totalnodes) {
      mstring = {
        p: [(widebox+levelSeparation) * level, miny-compensation + (maxy - miny) / 2, widebox,heightbox],
        yy: [miny, maxy],
        ln: smallbrother,
        rn: bigbrother
      };
    } else if (bigbrother < totalnodes && smallbrother >= totalnodes) {
      mstring = {
        p: [(widebox+levelSeparation) * level, miny-compensation + (maxy - miny) / 2, widebox,heightbox],
        yy: [miny, maxy],
        rn: bigbrother
      };
    } else if (bigbrother >= totalnodes && smallbrother < totalnodes) {
      mstring = {
        p: [(widebox+levelSeparation) * level, miny-compensation + (maxy - miny) / 2, widebox,heightbox],
        yy: [miny, maxy],
        ln: smallbrother,
      };
    } else {
      mstring = {
        p: [(widebox+levelSeparation) * level, miny-compensation + (maxy - miny) / 2, widebox,heightbox],
        yy: [miny, maxy]
      };
    }
  }else{
    mstring = {
      p: [(widebox+levelSeparation) * (level-1), miny + 80+15 , widebox,heightbox] 
    };
  }
  result[node] = mstring;
  //   if (!d.n[nodePointer].hasOwnProperty("y")) {
  //     d.n[nodePointer].y = [];
  //   }
  //   d.n[nodePointer].y[2] = maxy;
  //   d.n[nodePointer].y[1] = miny;
  //   d.n[nodePointer].y[0] = miny + (maxy - miny) / 2;
  return result; //d
}

function paintchilds(node, d, result) {
  var text = "";
  var temp = "";
  var totalnodes = d.n.length;
  for (let i = 0; i < totalnodes; i++) {
    if (d.n[i].p[0] == node) {
      if (d.n[i].hasOwnProperty("c")) {
        for (let j = 0; j < d.n[i].c.length; j++) {
          text += paintchilds(d.n[i].c[j], d, result);
        }
      }
      // for (let i = 0; i < d.n[i].p[1]; i++) {
      // temp += "&nbsp;&nbsp;&nbsp;&nbsp";
      // }
      console.log(result);
      temp +=
        " x:" +
        d.n[i].p[1] +
        ", min_y:" +
        result[node].yy[0] +
        " max_y:" +
        result[node].yy[1];
      return temp + "[" + node + "]: <br>" + text;
    }
  }
  return temp + "[" + node + "]: <br>" + text;
}

function test() {
  var mq = '"q":[50,20,35,20]';

  var s =
    '{"n":[' +
    '{"p":[1,null,null,90,40],"c":[2,3,4] ,' +
    mq +
    ',"g":3,"e":40},' +
    '{"p":[2,1,null,90,40],' +
    mq +
    ',"i":1},' +
    '{"p":[3,1,null,90,40],' +
    mq +
    "}," +
    '{"p":[4,1,null,90,40],"c":[15,16],' +
    mq +
    "}," +
    '{"p":[15,1,null,90,40],' +
    mq +
    "}," +
    '{"p":[16,1,null,90,40],' +
    mq +
    "}" +
    '],"c":{"base":[3,30,15,20,15,0,10,{},100,15],' +
    '"children-group":[3,30,15,20,7,0,1,{},100,15]},' +
    '"r":[1],"v":"8.07.00"}';

  s =
    '{"n":[{"p":[9999,null,null,90,40],"c":[7,9,2,3,4,15],"q":[50,20,35,20],"g":3,"e":40},{"p":[7,9999,null,90,40],"q":[50,20,35,20],"i":2},{"p":[9,9999,null,90,40],"q":[50,20,35,20],"i":1},{"p":[2,9999,null,90,40],"q":[50,20,35,20],"i":1},{"p":[3,9999,null,90,40],"q":[50,20,35,20]},{"p":[4,9999,null,90,40],"q":[50,20,35,20]},{"p":[15,9999,null,90,40],"q":[50,20,35,20]}],"c":{"base":[3,30,15,20,15,0,10,{},100,15],"children-group":[3,30,15,20,7,0,1,{},100,15]},"r":[9999],"v":"8.07.00"}';

  var d = JSON.parse(s);
  console.log(d);
  // for (let i = 0; i < 4; i++) {  text += d.n[i].p[0] + "<br>";  }
  //   const result = [{ id: 65531,     name: 'Alice', },  ];
  //   result.push({id: 65532, name: 'Bob'});
  var result = {};
  const root = 9999;
  let totalnodes = d.n.length;
  let nodePointer = findnodePointer(root, d);
  result = findchilds(
    totalnodes,
    rrr,
    nodePointer,
    root,
    d,
    0,
    0,
    result,
    totalnodes,
    totalnodes
  );

  console.log("result");
  console.log(result);
  console.log("ddd");
  console.log(ddd);
  //         var d_dummy="{\"1\":{\"p\":[0,15,90,40]},"+
  //       "\"2\":{\"p\":[0,95,90,40]},"+// level*3*levelSeparation , husband +2*y_height
  //       "\"3\":{\"p\":[120,0,90,40],\"rn\":4},"+ //right node of 4
  //       "\"4\":{\"p\":[120,55,90,40],\"ln\":3,\"rn\":15},"+// level*3*levelSeparation , num_child *(y_height+siblingSeparation)
  //       "\"15\":{\"p\":[120,110,90,40],\"ln\":4}}"; // left node of 4
  // console.log(JSON.parse(d_dummy));
  var output = paintchilds(1, d, result);
  //output = Date();
  //output = JSON.stringify(text);
  $("sandbox").update(output); 
}
