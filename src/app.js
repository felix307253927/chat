/**
 * @author Created by felix on 17-11-10.
 * @email   307253927@qq.com
 */
'use strict';
(function () {
  // var api = 'http://117.121.49.45:9001';
  var api = 'http://10.10.13.126:9091';
// var api = '/api'
  
  var win      = document.getElementById('win'),
      win_min  = document.querySelector('.chat-window-min'),
      win_drag = win.querySelector('.header'),
      close    = win.querySelector('.header .close'),
      sendBtn  = win.querySelector('.btn-send'),
      closeBtn = win.querySelector('.btn-close'),
      input    = win.querySelector('.inputbox'),
      scroll   = win.querySelector('.scrollarea'),
      ul       = scroll.querySelector('ul'),
      x = 0, y = 0,
      move     = false;
  
  function close_win(e) {
    e.preventDefault();
    e.stopPropagation();
    win.style.display     = 'none';
    win_min.style.display = 'block'
  }
  
  function padZore(v) {
    v = v.toString();
    return ('00' + v).substr(v.length)
  }
  
  function addText(text, right) {
    var li         = document.createElement('li'),
        av         = document.createElement('i'),
        box        = document.createElement('div'),
        msg        = document.createElement('div'),
        tip        = document.createElement('div'),
        b          = document.createElement('i'),
        time       = document.createElement('div'),
        date       = new Date();
    li.className   = 'item';
    av.className   = 'item-av';
    box.className  = 'item-text';
    tip.className  = 'item-tip';
    b.className    = 'bulges';
    time.className = 'item-time';
    if (right) {
      av.className += ' item-av-right';
      box.className += ' item-text-right';
      tip.className += ' item-tip-right';
      b.className += ' bulges-right';
      time.className += ' item-time-right';
    } else {
      tip.className += ' item-tip-left';
      b.className += ' bulges-left';
    }
    msg.textContent  = text;
    time.textContent = padZore(date.getHours()) + ':' + padZore(date.getMinutes()) + ':' + padZore(date.getSeconds())
    box.appendChild(msg);
    box.appendChild(tip);
    box.appendChild(b);
    li.appendChild(av);
    li.appendChild(box);
    li.appendChild(time);
    ul.appendChild(li);
    scroll.scrollTop = ul.offsetHeight;
    return tip
  }
  
  function send() {
    var text = input.value.replace(/^ +|[\r\n]+|[ ]+$/g, '')
    if (text) {
      var tip = addText(text, true);
      var xhr = !window.XDomainRequest ? new XMLHttpRequest() : new XDomainRequest()
      //http://10.10.13.126:9091/service/iss?text=%E4%BD%A0%E5%8F%AB%E5%95%A5&appkey=hjppipl5dhydtfo6bhlec7ysri2gmgbog5dvlmqa&ver=2.0&udid=JUnit-test393931&appsig=8FE5E15BF5C2C92D7C0B707DF92D6440F6154F16&appver=&city=&history=&time=2014-05-13+15%3A31%3A07&voiceid=&gps=&method=iss.getTalk&dpi
      xhr.open('get', api + '/service/iss?text=' + text + '&appkey=hjppipl5dhydtfo6bhlec7ysri2gmgbog5dvlmqa&ver=2.0&udid=JUnit-test393931&appsig=8FE5E15BF5C2C92D7C0B707DF92D6440F6154F16&appver=&city=&history=&time=2014-05-13+15%3A31%3A07&voiceid=&gps=&method=iss.getTalk&dpi=', true)
      var dealRespose = function (text) {
        var res;
        try {
          res = JSON.parse(text)
        } catch (e) {
          tip.className += ' error'
        }
        if (res.code === 'ANSWER' && res.general) {
          addText(res.general.text)
        } else {
          tip.className += ' error'
        }
      }
      if (!window.XDomainRequest) {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            dealRespose(xhr.response)
          }
        }
      } else {
        xhr.onload = function () {
          dealRespose(xhr.responseText)
        }
      }
      xhr.send()
    }
    input.value = ''
  }
  
  win_drag.addEventListener('mousedown', function (e) {
    if (e.target.className !== 'close') {
      e.stopPropagation();
      e.preventDefault();
      x    = e.clientX - win.offsetLeft;
      y    = e.clientY - win.offsetTop;
      move = true
    }
  })
  document.addEventListener('mouseup', function () {
    move = false
  })
  document.addEventListener('mousemove', function (e) {
    if (move) {
      var style = win.style,
          top   = e.pageY - y,
          left  = e.pageX - x;
      if (e.pageY - y > 0) {
        style.marginLeft = 0;
        style.left       = left + 'px';
        style.top        = top + 'px';
      }
    }
  })
  close.addEventListener('click', close_win)
  closeBtn.addEventListener('click', close_win)
  sendBtn.addEventListener('click', send)
  input.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
      send()
    }
  })
  win_min.addEventListener('click', function () {
    win.style.display     = 'block';
    win_min.style.display = 'none'
  })
  
  addText('您好，欢迎使用云知声智能客服，请问有什么可以帮您的？')
})()