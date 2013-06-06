
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
requirejs.config({
    shim: {
        underscore: {
            exports: '_'
        },
        jqueryui: {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: "/javascripts/lib/jquery-2.0.0.min",
        jqueryui: "/javascripts/lib/jquery-ui-1.10.2.min",
        jqm: "/javascripts/lib/jquery.mobile-1.3.0.min",
        json2: "/javascripts/lib/json2",
        underscore: "/javascripts/lib/underscore-1.3.3.min"
    }
});

var showError = function(msg, $form) {
    $basicPopup = $('#popupBasic');
    $basicPopup.find('p').html(msg || "未知错误");

    if ($form) {
        $basicPopup.on("popupafterclose", function(){$form.popup('open')});
        $form.on("popupafterclose", function(){$basicPopup.popup('open')});
        $form.on("popupafteropen", function(){
            $form.off("popupafterclose")
            $basicPopup.off("popupafterclose")
        });
        $form.popup('close');
    } else {
        $basicPopup.popup('open');
    }
}

var initAll = function() {
    $("body").show();

    $('.logout').on('click', function(){
        $.ajax('/user/logout.json', {
            type: 'POST',
            dataType: 'json',
            success: function(json) {
                if (json.isOk) {
                    location = '/';
                } else {
                    showError(json.errMsg);
                }
            }
        });
    });

    $('#popupLogin').on('click', '[type=submit]', function(e) {
        var $form = $('#popupLogin');
        $.ajax('/user/login.json', {
            type: 'POST',
            data: {
                email: $form.find('[name=email]').val(),
                password: $form.find('[name=password]').val()
            },
            dataType: 'json',
            success: function(json) {
                if (json.isOk) {
                    location = '/page/' + json.visitor.rootPageId;
                } else {
                    showError(json.errMsg, $form);
                }
            }
        });
    });

    $('#popupRegister').on('click', '[type=submit]', function(e) {
        var $form = $('#popupRegister');
        var email = $form.find('[name=email]').val();
        var password = $form.find('[name=pass]').val();
        var password2 = $form.find('[name=pass2]').val();

        if (password != password2) {
            showError('两次密码不相同', $form);
            return;
        }

        $.ajax('/user/register.json', {
            type: 'POST',
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            success: function(json) {
                if (json.isOk) {
                    location = '/page/' + json.rootPageId;
                } else {
                    showError(json.errMsg, $form);
                }
            }
        });
    });

    $('#addPage').on('click', '[type=submit]', function(e) {
        var $form = $('#addPage');
        $.ajax('/page/add.json', {
            type: 'POST',
            data: {
                parentId: $form.find('[name=parentId]').val(),
                title: $form.find('[name=title]').val(),
                content: $form.find('[name=content]').val()
            },
            dataType: 'json',
            success: function(json) {
                if (json.isOk) {
                    location = '/page/' + json.pageId;
                } else {
                    showError(json.errMsg);
                }
            }
        });
    });
    
    $('#editPage').on('click', '[type=submit]', function(e) {
        var $form = $('#editPage');
        var pageId = $form.find('[name=id]').val();
        $.ajax('/page/update.json', {
            type: 'POST',
            data: {
                id: pageId,
                title: $form.find('[name=title]').val(),
                content: $form.find('[name=content]').val()
            },
            dataType: 'json',
            success: function(json) {
                if (json.isOk) {
                    location = '/page/' + pageId;
                } else {
                    showError(json.errMsg);
                }
            }
        });
    });
    
    $(".deletePage").on('click', function() {
        var $form = $('#popupDeletePageConfirm');
        var $ele = $(this);
        $.ajax('/page/remove.json', {
            type: 'POST',
            data: {id: $ele.attr('data-page-id')},
            dataType: 'json',
            success: function(json) {
                if (json.isOk) {
                    location = '/page/' + $ele.attr('data-parent-id');
                } else {
                    showError(json.errMsg, $form);
                }
            }
        });
    });

    $('.sortable').sortable({
        stop: function(e, ui) {
            var $node = ui.item.parent();
            var id = $node.attr('id');
            var childIds = _($node.children()).map(function(child){
                return $(child).attr('id');
            });
            $.ajax('/page/sort.json', {
                type: 'POST',
                data: {id: id, childIds: childIds.join(",")},
                dataType: 'json',
                success: function(json) {
                }
            });
            //alert(idList);
            //ui.item.parent.children.each(function(i, ele){});
            //alert(ui.item.attr('id'));
        }
    });
};

requirejs(['jquery', 'underscore', 'jqueryui'], function($, _) {
    $( document ).on( "pagecreate", initAll);
    requirejs(['jqm'], function() {
    });
});

