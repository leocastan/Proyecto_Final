import { encodeImageFileAsURL } from './encodedImage.js'
import { resetValues, validateField, validateFieldsObject } from './formValidator.js'
import { getModal } from './modal.js'

let form = document.querySelector("form")
let body = document.querySelector("body")
let tbody = document.querySelector("tbody")
let { dni, name, course, image } = form
let {modal, showModal, hideModal} = getModal()
let formModal = modal.querySelector('form')
let {
    dni_update,
    name_update,
    course_update,
    image_update
} = formModal

loadCourses()
loadStudents()

let validator = {
    dni: /^([\d]{10})$/,
    name: /^([a-zA-ZáéíóúÁÉÍÓÚ\s]{2,})$/,
    course: false,
    image: false

}

let errors = {
    dni: "Por favor ingresa 10 números",
    name: "Nombre debe contener al menos 2 letras, solo se permiten letras y espacios",
    course: "Debes seleccionar el curso",
    image: "Debes seleccionar una imagen"
}

let data = {
    dni: "",
    name: "",
    course: "",
    image: ""
}

dni.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "dni",
        values: data,
        selector: ".error-dni",
        validator,
        errors
    }
    validateField(objectValidator) 
}

name.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "name",
        values: data,
        selector: ".error-name",
        validator,
        errors
    }
    validateField(objectValidator) 
}

course.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "course",
        values: data,
        selector: ".error-course",
        validator,
        errors
    }
    validateField(objectValidator) 
}

let validatorUpdate = {
    id_student: "",
    dni_update: /^([\d]{10})$/,
    name_update: /^([a-zA-ZáéíóúÁÉÍÓÚ\s]{2,})$/,
    course_update: false,
    image_update: false
}

let errorsUpdate = {
    dni_update: "Por favor ingresa 10 números",
    name_update: "Nombre debe contener al menos 2 letras, solo se permiten letras y espacios",
    course_update: "Debes seleccionar el curso",
    image_update: "Debes seleccionar una imagen"
}

let dataUpdate = {
    dni_update: "",
    name_update: "",
    course_update: ""
}

dni_update.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "dni_update",
        values: dataUpdate,
        selector: ".error-dni-update",
        validator: validatorUpdate,
        errors: errorsUpdate
    }
    validateField(objectValidator) 
}

name_update.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "name_update",
        values: dataUpdate,
        selector: ".error-name-update",
        validator: validatorUpdate,
        errors: errorsUpdate
    }
    validateField(objectValidator) 
}

course_update.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "course_update",
        values: dataUpdate,
        selector: ".error-course-update",
        validator: validatorUpdate,
        errors: errorsUpdate
    }
    validateField(objectValidator) 
}


image.addEventListener('change', async(e)=> {
    let imgError = document.querySelector(".error-image")
    if(!e.target.files[0]) {
        data.image = ""
        return
    }

    let file = e.target.files[0].name.split(".")
    let extens = ["png", "jpg"]
    let esValid = extens.includes(file[file.length - 1])
    if(!esValid) {
        Swal.fire(
            "Atención",
            "Solo se puede cargar archivos jpg y png",
            "warning"
        ). then(ok => {
            e.target.value = ""
            data.image = ""
            imgError.innerHTML = errors["image"]
            imgError.classList.remove("hidden")
        })
    } else {
        let encodedImage = await encodeImageFileAsURL(e.target)
        data.image = encodedImage
        imgError.innerHTML = ""
        imgError.classList.add("hidden")
    }
})

let dataImage = ""
image_update.addEventListener('change', async(e)=> {
    let imgError = document.querySelector(".error-image-update")
    if(!e.target.files[0]) {
        data.image = ""
        return
    }

    let file = e.target.files[0].name.split(".")
    let extens = ["png", "jpg"]
    let esValid = extens.includes(file[file.length - 1])
    if(!esValid) {
        Swal.fire(
            "Atención",
            "Solo se puede cargar archivos jpg y png",
            "warning"
        ). then(ok => {
            e.target.value = ""
            data.image = ""
            imgError.innerHTML = errors["image"]
            imgError.classList.remove("hidden")
        })
    } else {
        let encodedImage = await encodeImageFileAsURL(e.target)
        dataImage = encodedImage
        imgError.innerHTML = ""
        imgError.classList.add("hidden")
    }
})

form.onsubmit = async(e) => {
    e.preventDefault()
    const route = "/save-student"
    if(validateFieldsObject(data)) {
        let formData = new FormData()
        formData.append("dni", data.dni)
        formData.append("name", data.name)
        formData.append("image", data.image)
        formData.append("course", data.course)       
        let result = await fetch(route, {
            method: "POST",
            body: formData
        })

        let response = await result.json()
        if(response.saved) {
            Swal.fire("Listo", response.message, "success")
                .then(ok => {
                    form.reset()
                    loadStudents()
                    resetValues(data)
                })
        } else {
            Swal.fire("Error!", response.error, "error")
        }
    } else {
        Swal.fire("Atención!", "Debes llenar todos los campos", "warning")
    }
}

formModal.onsubmit = async(e) => {
    e.preventDefault()
    const route = "/update-student"

    if(validateFieldsObject(dataUpdate)) {
        let formData = new FormData()
        formData.append("id", dataUpdate.id_student)
        formData.append("dni", dataUpdate.dni_update)
        formData.append("name", dataUpdate.name_update)
        formData.append("image", dataImage)
        formData.append("course", dataUpdate.course_update)       
        let result = await fetch(route, {
            method: "POST",
            body: formData
        })

        let response = await result.json()
        if(response.updated) {
            Swal.fire("Listo", response.message, "success")
                .then(ok => {
                    formModal.reset()
                    loadStudents()
                    resetValues(dataUpdate)
                    hideModal()
                })
        } else {
            Swal.fire("Error!", response.error, "error")
        }
    } else {
        Swal.fire("Atención!", "Debes llenar todos los campos", "warning")
    }
}

function loadCourses() {
    const route = "/get-courses"
    let optDefault = `
        <option value = "">
            Selecciona el aula
        </option>
    `
    course_update.innerHTML = optDefault
    course.innerHTML = optDefault

    $.get(route, (response) => {
        response.forEach((data) => {
            let option = `
            <option value="${data._id.$oid}">
                ${data.course + " - " + data.parallel}
            </option>
            `
            course.innerHTML += option
            course_update.innerHTML += option
        }); 
    })
}

function loadStudents() {
    const route = "/get-students"
    tbody.innerHTML = ""
    $.get(route, (response) => {
        if(response.length === 0) {
            tbody.innerHTML= `
            <tr>
                <td class="text-center" colspan="7">
                    No hay estudiantes registrados
                </td>
            </tr>
            `
        } else {
            response.forEach((data, index) => {
                let id = data._id.$oid
                let course = data.course[0]
                let courseName = course.course + " " + course.parallel
                let courseId = course._id.$oid
                
            let row = `
            <tr data-id="${id}">
                <th scope="row" class="text-center">${index + 1}</th>
                <td>${data.dni}</td>
                <td>
                    <img src="${data.image}" alt="img"/>
                </td>
                <td>${data.name}</td>
                <td>${data.username}</td>
                <td data-id=${courseId}>${courseName}</td>
                <td>
                    <button class="btn btn-primary" data-update="${id}">
                        Editar
                    </button>
                    <button class="btn btn-danger" data-delete="${id}">
                        Borrar
                    </button>
                </td>
            </tr>`
            tbody.innerHTML += row
            })
        }
    })
}

function deleteStudent(id) {
    const route = "/delete-student"
    $.post(route, {id}, (response) => {
        if(response.deleted) {
            Swal.fire("Atención", "¿Está seguro de eliminar este estudiante?", "warning")
                .then(ok => {
                    if(ok) {
                        Swal.fire("Listo", response.message, "success")
                            .then(ok => {
                                loadStudents()
                            })
                    }
                })
        } else {
            Swal.fire("Error!", response.error, "error")
        }
    })
}

body.onclick = async (e) => {
    let element = e.target
    let updateID = element.dataset.update
    let deleteID = element.dataset.delete

    if( updateID ) {
        let row = element.parentNode.parentNode
        let tds = row.querySelectorAll('td')
        let dni = tds[0].innerHTML
        let name = tds[2].innerHTML
        let course = tds[4].dataset.id
        dataUpdate.id_student = updateID

        let data = {
            dni_update: dni,
            name_update: name,
            course_update: course
        }

        dataUpdate = {...dataUpdate, ...data}
        showModal(data)
    }

    if (deleteID) {
        deleteStudent(deleteID)
    }

} 

