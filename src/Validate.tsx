import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from "./Layout";
import {useNavigate} from "react-router";
import {useAppSelector} from "./redux/hooks";
import {useCompleteProcessMutation, useRegisterMutation} from "./redux/query";

function Validate() {
    const navigate = useNavigate()
    const { registrationRequestId } = useAppSelector((state) => state.app)
    const [ code, setCode ] = useState('')
    const [ codeIncorrect, setCodeIncorrect ] = useState(false)

    const [ validate, { data: validation }] = useCompleteProcessMutation()

    const submit = () => {
        const isCodeOk = code.match(/[0-9]{6}/)
        setCodeIncorrect(!isCodeOk)
        if (isCodeOk) {
            validate({requestId: registrationRequestId, validationCode: code})
        }
    }

    useEffect(() => {
        if (validation === 'ok') {

        }
    }, [validation])
  return (
      <Layout>
      <div id="validation"
           className="bottom-0 left-0 w-screen pt-4 flex flex-col h-full">
          <div className="mx-8 text-sm text-justify">Please enter the validation code you have received by SMS</div>
          <form className="flex dlex-auto mt-8 px-8 flex-col w-full">
              <div className="relative flex w-full flex-wrap items-stretch mb-3">
                  <input id="code" name="code" type="text" style={codeIncorrect?{borderColor: 'darkred', borderWidth: '2px'}:{}} placeholder="Validation code" value={code} onChange={(e) => setCode(e.target.value)}
                         className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                  <span
                      className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
     stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
</svg></span></div>
              <button id="button"
                      className="flex flex-nowrap mt-4 mb-1 mx-auto justify-center w-48 bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button" onClick={() => submit()}>
			<span className="mr-4 my-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg></span>
                  <span className="pt-0.5" id="button-label">Submit</span>
              </button>
              <div className="self-center py-16">
                  <canvas id="qr" className="w-48 h-48"/>
              </div>
          </form>
      </div>
      </Layout>
  );
}

export default Validate;
