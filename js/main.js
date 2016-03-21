$(document).ready(function() {
	$('#add_category').submit(addCategory);
	$('#edit_category').submit(editCategory);

	$('#add_task').submit(addTask);

	$('body').on('click', '.btn-edit-category', setCategory);
	$('body').on('click', '.btn-delete-category', deleteCategory);
});
var api_key = '0Ka0SkEcZ995DKW60jYI2_aup1taUM-U';

function getCategories() {
	$.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=' + api_key, function( data ) { 
		var output = '<ul class="list-group">';
		$.each( data, function( key, data ) {
			output += '<li class="list-group-item category">' +
			data.category_name +
			'<div class="pull-right"><a class="btn btn-primary btn-edit-category" data-category-id="' + data._id.$oid + '">Edit</a>  <a class="btn btn-danger btn-delete-category" data-category-id="' + data._id.$oid + '">Delete</a></div>'
			'</li>';
			console.log(data);
		});
		

		output += '</ul>';
		$('#categories').html(output);
	});
}

function addCategory() {
	var category_name = $('#category_name').val();
	$.ajax({
		url:  'https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=' + api_key,
		data: JSON.stringify({
			"category_name": category_name
		}),
		type: 'POST',
		contentType: 'application/json',
		success: function(data) {
			window.location.href = 'categories.html';
		},
		error: function(xhr, status, err) {
			console.log(err);
		}
	});
	return false;
}

function editCategory() {
	var category_id = sessionStorage.getItem('currentCategoryid');
	var category_name = $('#category_name').val();
	$.ajax({
		url:  'https://api.mlab.com/api/1/databases/taskmanager/collections/categories/' + category_id + '?apiKey=' + api_key,
		data: JSON.stringify({
			"category_name": category_name
		}),
		type: 'PUT',
		contentType: 'application/json',
		success: function(data) {
			window.location.href = 'categories.html';
		},
		error: function(xhr, status, err) {
			console.log(err);
		}
	});
	return false;
}

function setCategory() {
	var category_id = $(this).data('category-id');
	sessionStorage.setItem('currentCategoryid', category_id);
	window.location.href='editcategory.html'
	return false;
}

function getCategory() {
	var category_id = sessionStorage.getItem('currentCategoryid');
	$.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories/' + category_id + '?apiKey=' + api_key, function(data) {
		$('#category_name').val(data.category_name);
	});
}

function getCategoryOptions() {
	var output;
	$.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=' + api_key, function(data) {
		$.each(data, function(key, data) {
			output += '<option value="' + data.category_name + '">' + data.category_name + '</option>'
		});
		$('#category').append(output);
	});
}

function deleteCategory() {
	var category_id = $(this).data('category-id');
	$(this).removeClass('btn-danger');
	var loader = '<img src="http://content.buonissimo.org/standard/images/loading_black.gif" class="img img-responsive"></img>';
	$(this).html(loader);
	$.ajax({
		url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/categories/' + category_id + '?apiKey=' + api_key,
		type: 'DELETE',
		async: true,
		timeout: 300000,
		success: function(data) {
			window.location.href = 'categories.html';
		},
		error: function(xhr, status, err) {
			console.log(err);
		}
	});
	return false; 
}

function addTask() {
	var task_name = $('#task_name').val();
	var category = $('#category').val();
	var due_date = $('#due_date').val();
	var is_urgent = $('#is_urgent').val();

	$.ajax({
		url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey=' + api_key,
		data: JSON.stringify({
			"task_name": task_name,
			"category": category,
			"due_date": due_date,
			"is_urgent": is_urgent
		}),
		type: "POST",
		contentType: "application/json",
		success: function(data) {
			window.location.href = "index.html";
		},
		error: function(xhr, status, err) {
			console.log(err);
		}
	});
	return false;
}	

function getTasks(){
	$.get( 'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey=' + api_key, function( data ) {
  		var output = '<ul class="list-group">';
        $.each(data, function(key, data){
        	output += '<li class="task list-group-item">';
            output += data.task_name+' <span class="due_on">[Due on '+data.due_date+']</span>';
                if(data.is_urgent == "yes"){
                	output += ' <span class="label label-danger">Urgent</span>';
                }
            output += '<div class="pull-right"><a class="btn btn-primary btn-edit-task" data-task-name="'+data.task_name+'" data-task-id="'+data._id.$oid+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+data._id.$oid+'">Delete</a></div>';
            output += '</li>';
        })
        output += '</ul>';
  		$("#tasks").html(output);
	});
}