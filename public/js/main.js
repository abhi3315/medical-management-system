$('.edit').on('click', function () {
    const id = this.id
    const branch = $('#' + id)
    $('#_id').val(branch.data('id'))
    $('#branchName').val(branch.data('name'))
    $('#discount').val(branch.data('discount'))
    $('#mymodal').modal('toggle')
})