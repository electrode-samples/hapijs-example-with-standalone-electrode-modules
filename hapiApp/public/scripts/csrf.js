"use strict";

console.log("working");

function doPOST(csrfHeader, shouldFail, resultId) {
  console.log('.love> '+ csrfHeader);
  $.ajax({
    type: 'POST',
    data: JSON.stringify({ message: "hello" }),
    headers: {
      "x-csrf-jwt": csrfHeader
    },
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    url: '/2',
    success: function (data, textStatus, xhr) {
      let msg = 'POST SUCCEEDED with status ' + xhr.status + 
        ' ' + (shouldFail ? 'but expected error' : 'as expected');
      console.log(msg);
      $(resultId).html('<p>' + msg + '</p>');
    },
    error: function (xhr, textStatus, error) {
      let msg = 'POST FAILED with status ' + xhr.status + 
        ' ' + (shouldFail ? 'as expected' : 'but expected success');
      console.log(msg);
      $(resultId).html('<p>' + msg + '</p>');
    }
  });
}

$(function () {
  $('#test-valid-link').click(function (e) {
    e.preventDefault();
    console.log('test-valid-link clicked');
    $.ajax({
      type: 'GET',
      url: '/1',
      xhrFields: {
        withCredentials: true
      },
      success: function (data, textStatus, xhr) {
        console.log('GET: success');
        let csrfHeader = xhr.getResponseHeader('x-csrf-jwt');
        if (csrfHeader != '') {
          console.log('> Got x-csrf-jwt token OK\n');
        }
        let csrfCookie = Cookies.get('x-csrf-jwt');
        if (csrfCookie != '') {
          console.log('> Got x-csrf-jwt cookie OK\n');
        }

        doPOST(csrfHeader, false, '#test-results');
      }
    });
  });

  $('#test-invalid-link').click(function (e) {
    e.preventDefault();
    console.log('test-invalid-link clicked');
    doPOST('fake', true, '#test-results');
  });
}); 
