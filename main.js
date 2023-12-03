/*version v2*/
function updateBin(data,binId,key) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText );
    }
  }
  let binlocation="https://api.jsonbin.io/v3/b/" + binId;
  req.open("PUT",binlocation, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("X-Master-Key",key);
  req.setRequestHeader("X-Bin-Versioning", true);
  req.send(data);
   
}

function deleteBinVersion(binId,key) {
  
  let req =new XMLHttpRequest ();
  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText );
    }
  } 
  let binlocation = "https://api.jsonbin.io/v3/b/"+binId+"/versions";
  req.open("DELETE",binlocation, true);
  req.setRequestHeader("X-Master-Key",key);
  req.setRequestHeader("X-Preserve-Latest",true);
  req.send();
};

function store(uniqueIndex ,obj,binId,key) {
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      
      let receivedData=JSON.parse(req.responseText);
      receivedData[uniqueIndex]=obj; 
      let finalData = JSON.stringify(receivedData);

      updateBin(finalData,binId,key);
      deleteBinVersion(binId,key); 
      
    }
  }
  let l="https://api.jsonbin.io/v3/b/"+binId+"?meta=false"
  req.open("GET",l, true);
  req.setRequestHeader("X-Master-Key",key);
  req.send()
}   

function retrieveBin(binId, key, callback) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      var receivedData = JSON.parse(req.responseText);
      console.log(receivedData);
      callback(receivedData); // Use a callback function to handle the retrieved data
    }
  }
  let l = "https://api.jsonbin.io/v3/b/" + binId + "?meta=false";
  req.open("GET", l, true);
  req.setRequestHeader("X-Master-Key", key);
  req.send();
}


function uniqueId(fullname, binId, key, callback) {
  retrieveBin(binId, key, function(data) {
    var keys = Object.keys(data).reverse();
    var change = false;
    for (let i in keys) {
      if (i.split(/(\d+)/)[0] == fullname) {
        let n = Number(i.split(/(\d+)/)[1]) + 1;
        let s = n.toString();
        var change = true;
        callback(fullname + s);
        return;
      }
    }
    if (change == false) {
      callback(fullname + "0");
    }
  });
}