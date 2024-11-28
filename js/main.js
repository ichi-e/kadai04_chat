import { app, db, dbRef } from "./firebaseConfig.js";
import { getDatabase, ref, push, set, onChildAdded, update, remove, onChildChanged, onChildRemoved }
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

$("#send").on("click", function () {
    let date = new Date();


    console.log(date);
    const msg = {
        uname : $("#uname").val(),
        text: $("#text").val(),
        time: date.toLocaleString()
    }
    const newPostRef = push(dbRef); // ユニークキー
    
    set(newPostRef, msg)

    $("#uname").val("");
    $("#text").val("");
    $("#popup").prop('checked', false);
    
})

onChildAdded(dbRef, function(data){
    const msg =data.val();
    const key = data.key;
    const replaceText = msg.text.replace(/\n/g,'<br>')
    let h = `
    <div id="${key}" class="msg_wrap">
        <p class="title">${msg.uname}</p>
        <div contentEditable="true" id="${key}_update" class="msg_area">
            <p>${replaceText}</p>
            <p class="remove" data-key="${key}">×</p>
        </div>
        <div class="msg_info">
            <p class="time">${msg.time}</p>
            <p class="update" data-key="${key}"><img src="icon.png" alt="更新"></p>
        </div>
    </div>
    `
    console.log(msg);
    $("#output").append(h);
})

// 削除
$("#output").on("click", ".remove", function(){
    const key = $(this).attr("data-key");
    const remove_item = ref(db, "chat/"+key);
    remove(remove_item);
});

// 更新
$("#output").on("click", ".update", function () {
    const key = $(this).attr("data-key");
    const updatedText = $("#" + key + "_update")
    .html()
    .replace(/<div>/g, "\n")
    .replace(/<\/div>/g, "")
    .replace(/<br>/g, "\n");
    
    update(ref(db, "chat/"+key),{
        text: updatedText
    });
    console.log(key)
});

onChildRemoved(dbRef, (data) => {
    $("#"+data.key).remove();
});

onChildChanged(dbRef, (data) => {
    const replaceText = data.val().text.replace(/\n/g,'<br>')
    $("#" + data.key + '_update').html(replaceText);
    $("#" + data.key + '_update').fadeOut(800).fadeIn(800);
});