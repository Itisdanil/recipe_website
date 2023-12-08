document.querySelector('.add-ing').addEventListener('click', () => {
    let input = document.getElementById('ing');
    let content = input.value;
    input.value = '';

    let list = document.querySelector('main ul');
    let str =  `<input type=\"text\" value=\"${content}\"/>\n` +
        "<img src=\"/image/other/close-circle.png\" alt=\"img\">\n";
    let li = appendHtml(list, str);
    addClose(li);


});

document.querySelectorAll('main ul li').forEach(li => addClose(li));

document.querySelector('.add-step').addEventListener('click', () => {
    let input = document.getElementById('step');
    let content = input.value;
    input.value = '';

    let list = document.querySelector('main ol');
    let str =  `<input type=\"text\" value=\"${content}\"/>\n` +
        "<img src=\"/image/other/close-circle.png\" alt=\"img\">\n";
    let li = appendHtml(list, str);
    addClose(li);


});

document.querySelectorAll('main ol li').forEach(li => addClose(li));

function addClose(li) {
    li.querySelector('img').addEventListener('click', () => {
        li.remove();
    });
}


function appendHtml(el, str) {
    let li = document.createElement('li');
    li.innerHTML = str;
    el.appendChild(li);

    return li;
}

