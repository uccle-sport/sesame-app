import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from "./Layout";
import {useNavigate} from "react-router";
import { useAppSelector} from "./redux/hooks";
import {useCompleteProcessMutation } from "./redux/query";
import {arrowCircleLeft,checkCircle,key} from "./icons"

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
            navigate('/')
        }
    }, [validation])
  return (
      <Layout>
          <div id="validation"
               className="bottom-0 left-0 w-screen flex flex-col h-full">
              <div className="px-9 mt-8 text-justify">Please enter the validation code you have received by SMS</div>
              <form className="flex dlex-auto mt-8 px-8 flex-col w-full">
                  <div className="relative flex w-full flex-wrap items-stretch mb-3">
                      <input id="code" name="code" type="text"
                             style={codeIncorrect ? {borderColor: 'darkred', borderWidth: '2px'} : {}}
                             placeholder="Validation code" value={code} onChange={(e) => setCode(e.target.value)}
                             className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                      <span className="z-10 h-full leading-snug absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">{key()}</span>
                  </div>
                  <div className="flex">
                      <button id="button"
                              className="flex flex-nowrap mt-4 mr-1 mb-1 mx-auto justify-center bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-3 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                              type="button" onClick={() => submit()}>
                          <span className="mr-2 my-auto">{checkCircle()}</span>
                          <span className="pt-0.5" id="button-label">Submit</span>
                      </button>
                      <button id="button"
                              className="flex flex-nowrap mt-4 ml-1 mb-1 mx-auto justify-center bg-secondary text-white font-bold uppercase text-sm px-3 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                              type="button" onClick={() => navigate('/settings')}>
                          <span className="mr-2 my-auto">{arrowCircleLeft()}</span>
                          <span className="pt-0.5" id="button-label">I got no code</span>
                      </button>
                  </div>
              </form>
          </div>
      </Layout>
  );
}

export default Validate;
