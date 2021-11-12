import {FormLoader} from "../src/FormLoader"
import faker from "faker"

describe("load-dockform-script",()=>{
    
    test("no dockform script tag",()=>
    {
        document.body.innerHTML =`
        <form id="myform"></form>
        `
        const f = new FormLoader()
        const ret = f.collectScriptTagParams()
        expect(ret).toEqual(false)
        expect(f.error.length).toBeGreaterThan(0)
    })
    
    test("load dockform script tag get dockid",()=>
    {
        const fid = faker.random.word()
        document.body.innerHTML =`
        <form id="myform"></form>
        <script id="dockform_loader" src="dock.app?f=${fid}"></script>
        `
        const f = new FormLoader()
        const ret = f.collectScriptTagParams()
        expect(ret).toEqual(true)
        expect(f.dockFormID).toEqual(fid)
    })
    
    test("load dockform script tag no dockid",()=>
    {
        document.body.innerHTML =`
        <form id="myform"></form>
        <script id="dockform_loader" src="dock.app"></script>
        `
        const f = new FormLoader()
        const ret = f.collectScriptTagParams()
        expect(ret).toEqual(false)
        expect(f.error.length).toBeGreaterThan(0)
    })
    
    test("load dockform script tag with form id",()=>
    {
        const idOfForm = faker.random.word()
        const fid = faker.random.word()
        document.body.innerHTML =`
        <form id="${idOfForm}"></form>
        <script id="dockform_loader" src="dock.app?f=${fid}&i=${idOfForm}"></script>
        `
        const f = new FormLoader()
        const ret = f.collectScriptTagParams()
        expect(ret).toEqual(true)
        expect(f.dockFormID).toEqual(fid)
        expect(f.clientFormID).toEqual(idOfForm)
        
    })
    
    test("form id does not exist",()=>
    {
        const idOfForm = faker.random.word()
        const anotherID = faker.random.word()
        const fid = faker.random.word()
        document.body.innerHTML =`
        <form id="${idOfForm}"></form>
        <script id="dockform_loader" src="dock.app?f=${fid}&i=${anotherID}"></script>
        `
        const f = new FormLoader()
        const ret = f.loadForm()
        expect(ret).toEqual(false)
        expect(f.error.length).toBeGreaterThan(0)
    })
    
    test("select form by id",()=>
    {
        const idOfForm = faker.random.word()
        const fid = faker.random.word()
        document.body.innerHTML =`
        <form id="${idOfForm}"></form>
        <script id="dockform_loader" src="dock.app?f=${fid}&i=${idOfForm}"></script>
        `
        const f = new FormLoader()
        const ret = f.loadForm()
        expect(ret).toEqual(true)
        expect(f.dockFormID).toEqual(fid)
        expect(f.clientFormID).toEqual(idOfForm)
        
        expect(f.form).not.toBeNull()
        if(f.form != null)
        {
            expect(f.form.id).toEqual(idOfForm)    
        }
        
    })
    
    test("select single form",()=>
    {
        const formName = faker.random.word()
        const fid = faker.random.word()
        document.body.innerHTML =`
        <form name="${formName}"></form>
        <script id="dockform_loader" src="dock.app?f=${fid}"></script>
        `
        const f = new FormLoader()
        const ret = f.loadForm()
        expect(ret).toEqual(true)
        expect(f.dockFormID).toEqual(fid)
        
        expect(f.form).not.toBeNull()
        if(f.form != null)
        {
            expect(f.form.name).toEqual(formName)    
        }
        
    })
    
    test("many forms in the page",()=>
    {
        const formName = faker.random.word()
        const fid = faker.random.word()
        document.body.innerHTML =`
        <form name="${formName}"></form>
        <form name="${formName+"1"}"></form>
        <form name="${formName+"2"}"></form>
        <script id="dockform_loader" src="dock.app?f=${fid}"></script>
        `
        const f = new FormLoader()
        const ret = f.loadForm()
        expect(ret).toEqual(false)
        expect(f.form).toBeNull()
        expect(f.error.length).toBeGreaterThan(0)
        
    })
    
    test("no forms in the page",()=>
    {
        const fid = faker.random.word()
        document.body.innerHTML =`
        <h1>My Form Page</h1>
        <script id="dockform_loader" src="dock.app?f=${fid}"></script>
        `
        const f = new FormLoader()
        const ret = f.loadForm()
        expect(ret).toEqual(false)
        expect(f.form).toBeNull()
        expect(f.error.length).toBeGreaterThan(0)
        
    })
    
    
    
    
})