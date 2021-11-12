import {FormElement} from "../src/submission/FormElement"
import faker from "faker"
import $ from "@sisukas/jquery"

describe("extract-input-values",()=>{
    
    test("getting text input value",()=>
    {
        const text_name = faker.random.word()
        document.body.innerHTML =`
        <form id="myform">
        <input type="text" name="${text_name}" />
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        const fd = new FormElement(<HTMLElement>form.elements[0])
        const inp = form.elements[0]
        const v = faker.random.word()
        $(inp).val(v)
        expect(fd.getValue()).toEqual(v)
        
    })
    
    test("getting text input array value",()=>
    {
        const text_name = faker.random.word()
        document.body.innerHTML =`
        <form id="myform">
        <input type="text" name="${text_name}" />
        <br/>
        <input type="text" name="${text_name}" />
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        const fd = new FormElement(<HTMLElement>form.elements[0])
        const inp1 = form.elements[0]
        const v1 = faker.random.word()
        $(inp1).val(v1)
        
        const inp2 = form.elements[1]
        const v2 = faker.random.word()
        $(inp2).val(v2)
        
        const res = fd.getValue()
        expect(res).toBeInstanceOf(Array)
        expect(res).toHaveLength(2)
        expect(res).toContain(v1)
        expect(res).toContain(v2)
        
    })
    
    test("getting text input array with []",()=>
    {
        const text_name = faker.random.word()+"[]"
        document.body.innerHTML =`
        <form id="myform">
        <input type="text" name="${text_name}" />
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        const fd = new FormElement(<HTMLElement>form.elements[0])
        const inp1 = form.elements[0]
        const v1 = faker.random.word()
        $(inp1).val(v1)
        const res = fd.getValue()
        expect(res).toBeInstanceOf(Array)
        expect(res).toHaveLength(1)
        expect(res).toContain(v1)
        
    })
    
    test("getting single checkbox value",()=>
    {
        const chk_name1 = faker.random.word()
        const chk_name2 = faker.random.word()
        
        document.body.innerHTML =`
        <form id="myform">
        <input class="form-check-input" type="checkbox" id="${chk_name1}">
        <input class="form-check-input" type="checkbox" id="${chk_name2}">
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        
        const inp1 = form.elements[0]
        $(inp1).click()
        const inp2 = form.elements[1]
        
        const fd1 = new FormElement(<HTMLElement>inp1)
        const res1 = fd1.getValue()
        expect(res1).toEqual(true)
        
        const fd2 = new FormElement(<HTMLElement>inp2)
        const res2 = fd2.getValue()
        expect(res2).toEqual(false)
        
    })
    
    test("getting single checkbox with custom value",()=>
    {
        const chk_name1 = faker.random.word()
        const chk_name2 = faker.random.word()
        
        document.body.innerHTML =`
        <form id="myform">
        <input class="form-check-input" value="agree" type="checkbox" id="${chk_name1}">
        <input class="form-check-input" value="option" type="checkbox" id="${chk_name2}">
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        const inp1 = form.elements[0]
        $(inp1).click()
        const inp2 = form.elements[1]
        
        const fd1 = new FormElement(<HTMLElement>inp1)
        const res1 = fd1.getValue()
        expect(res1).toEqual("agree")
        
        const fd2 = new FormElement(<HTMLElement>inp2)
        const res2 = fd2.getValue()
        expect(res2).toEqual(false)
        
    })
    
    test("getting checkbox group with custom value",()=>
    {
        const chk_name = faker.random.word()+[]
        
        document.body.innerHTML =`
        <form id="myform">
        <input class="form-check-input" value="red" type="checkbox" name="${chk_name}">
        <input class="form-check-input" value="green" type="checkbox" name="${chk_name}">
        <input class="form-check-input" value="blue" type="checkbox" name="${chk_name}">
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        const inp1 = form.elements[0]
        $(inp1).click()
        const inp2 = form.elements[1]
        $(inp2).click()
        
        const fd1 = new FormElement(<HTMLElement>inp1)
        const res = fd1.getValue()
        expect(res).toEqual(["red","green"])
    })
    
    test("getting radio group",()=>
    {
        const radio_name = faker.random.word()
        const values:string[]=[]
        values.push(faker.random.word())
        values.push(faker.random.word())
        values.push(faker.random.word())
        
        document.body.innerHTML =`
        <form id="myform">
        <input class="form-check-input" value="${values[0]}" type="radio" name="${radio_name}">
        <input class="form-check-input" value="${values[1]}" type="radio" name="${radio_name}">
        <input class="form-check-input" value="${values[2]}" type="radio" name="${radio_name}">
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        let idx = faker.random.number(3) - 1 
        idx = (idx<0) ? 0:idx;
        
        const inpx = form.elements[idx]
        $(inpx).click()
        
        const fd = new FormElement(<HTMLElement>inpx)
        const res = fd.getValue()
        expect(res).toEqual(values[idx])
        
    })
    
    test("getting radio group",()=>
    {
        document.body.innerHTML =`
        <form id="myform">
        <select name="multinum" class="form-control" >
            <option id="rr">red</option>
            <option id="gg">green</option>
            <option id="bb">blue</option>
            <option id="yy">yellow</option>
        </select>
        </form>
        `;
        
        const form = <HTMLFormElement>$("#myform")[0]
        const inp = form.elements[0]
        let idx = faker.random.number(3) - 1 
        idx = (idx<0) ? 0:idx;
        
        $('#gg').prop('selected', true);
        
        const fd = new FormElement(<HTMLElement>inp)
        const res = fd.getValue()
        expect(res).toEqual("green")
        
    })
    
    
    // <input class="form-check-input" type="checkbox" id="checkUpdates">
})