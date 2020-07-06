$('.edit').on('click', function () {
    const id = this.id
    const branch = $('#' + id)
    $('#_id').val(branch.data('id'))
    $('#branchName').val(branch.data('name'))
    $('#discount').val(branch.data('discount'))
    $('#mymodal1').modal('toggle')
})

$('.print').on('click', function () {
    const id = this.id
    const patient = $('#' + id).data('patient')
    $('#_id').val(patient._id)
    $('#description').val(patient.patientInfo)
    $('#mymodal3').modal('toggle')
})

$('#new-branch').on('click', function () {
    $('#mymodal2').modal('toggle')
})