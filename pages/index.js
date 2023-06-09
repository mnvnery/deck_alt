import Head from 'next/head'
import Header from '@/components/Header'
import Home from '@/components/pages/Home'
import DetailsPage from '@/components/pages/DetailsPage'
import SuitPage from '@/components/pages/SuitPage'
import ButtonClick from '@/components/ButtonClick'
import { useState, useEffect } from 'react'
import BaseInfoPage from '@/components/pages/BaseInfoPage'
import { Unity, useUnityContext } from 'react-unity-webgl'
import Loader from '@/components/Loader'
import SillouettePage from '@/components/pages/SillouettePage'
import ProductPage from '@/components/pages/ProductPage'
import FabricPage from '@/components/pages/FabricPage'
import CheckoutPage from '@/components/pages/CheckoutPage'


export default function Index() {
    const { unityContext, unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded, loadingProgression } = useUnityContext({
        loaderUrl: '/unity/Build/TheDeckModelViewer.loader.js',
        dataUrl: '/unity/Build/TheDeckModelViewer.data',
        frameworkUrl: '/unity/Build/TheDeckModelViewer.framework.js',
        codeUrl: '/unity/Build/TheDeckModelViewer.wasm',
    });
    const [formData, setFormData] = useState({});
    const [step, setStep] = useState(1)
    const [sizeData, SetSizeData] = useState(null)
    const [productNumber, setProductNumber] = useState(null);
    const [jacketFabricChosen, setJacketFabricChosen] = useState(false);
    const [trouserFabricChosen, setTrouserFabricChosen] = useState(false)
    const [selectedJacket, setSelectedJacket] = useState(false);
    const [selectedTrousers, setSelectedTrousers] = useState(false);
    const [selectedWaistcoat, setSelectedWaistcoat] = useState(false);

    const handleProduct = (data) => {
        setProductNumber(data)
    }

    const selectJacket = (data) => {
        setSelectedJacket(data)
    }

    const selectTrousers = (data) => {
        setSelectedTrousers(data)
    }

    const selectWaistcoat = (data) => {
        setSelectedWaistcoat(data)
    }


    const handleNextStep = () => {
        if (step === 7) {
            if ([0, 1].includes(productNumber) && jacketFabricChosen && trouserFabricChosen) {
                setStep(step + 1)
            } else if (productNumber === 2 && jacketFabricChosen) {
                setStep(step + 1)
            } else if (productNumber === 3 && trouserFabricChosen) {
                setStep(step + 1)
            } else {
                alert('Please make your fabric selection!')
            }
        } else if (step === 5) {
            if (productNumber === 0 && selectedJacket && selectedTrousers && selectedWaistcoat) {
                setStep(step + 1)
            } else if (productNumber === 1 && selectedJacket && selectedTrousers) {
                setStep(step + 1)
            } else if (productNumber === 2 && selectedJacket) {
                setStep(step + 1)
            } else if (productNumber === 3 && selectedTrousers) {
                setStep(step + 1)
            } else {
                alert('Please make your sillouette selection!')
            }
        } else if (step === 4) {
            if (productNumber !== null) {
                setStep(step + 1)
            } else {
                alert('Please make your suit type selection!')
            }
        } else {
            setStep(step + 1)
        }
    }

    const resetSteps = () => {
        setStep(1)
    }


    const handlePrevStep = () => {
        setStep(step - 1)
    }

    function handleSize(data) {
        //setFormData(data)
        if (isLoaded) {
            // sendMessage("[Bridge]", "ChangeQuality", 2);
            sendMessage("[Bridge]", "SetSizeData", JSON.stringify(data));
        }
        SetSizeData(JSON.stringify(data));
    }

    function handleGarments() {
        sendMessage("[Bridge]", "SetSizeData", sizeData);
        sendMessage("[Bridge]", "ShowGarments");
    }

    function handlePose() {
        sendMessage("[Bridge]", "ChangePose");
    }

    function handleJacket(num) {
        sendMessage("[Bridge]", "ChangeOuterFabricJacket", `${num}`);
        setJacketFabricChosen(true)
    }

    function handleTrousers(num) {
        sendMessage("[Bridge]", "ChangeOuterFabricTrousers", `${num}`);
        setTrouserFabricChosen(true);
    }


    return (
        <>
        <Head>
            <title>The Deck Configurator</title>
            <meta name="description" content="The Deck Configurator" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        {step === 1 ?
        <Header fill='white' resetSteps={resetSteps}/>
        :
        <Header fill='#2F2727' resetSteps={resetSteps} />
        }
        {/* Unity Build */}
        <div style={{ position: 'fixed', top: '0', left:'0', width: '100%', height: '100%', paddingBottom: '56.25%' }} className={`z-0 ${step === 2 && 'pointer-events-none'}`}>
        {!isLoaded && (
            <Loader text={'Generating measurements'} progress={Math.round(loadingProgression * 100)} />
        )}
        <Unity
            unityProvider={unityProvider}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }}
            />
        </div>
        {/* End of Unity */}
        {step === 1 && <Home onNextStep={handleNextStep} />}
        {step === 2 && <BaseInfoPage onPrevStep={handlePrevStep} onNextStep={handleNextStep} handleSize={handleSize}/>}
        {step === 3 && <DetailsPage onPrevStep={handlePrevStep} handleSize={handleSize}/>}
        {step === 4 && <SuitPage handleProduct={handleProduct}/>}
        {step === 5 && <SillouettePage selectJacket={selectJacket} selectTrousers={selectTrousers} selectWaistcoat={selectWaistcoat} />}
        {step === 6 && <ProductPage onNextStep={handleNextStep} start={handleGarments} pose={handlePose}/>}
        {step === 7 && <FabricPage onNextStep={handleNextStep} handleJacket={handleJacket} handleTrousers={handleTrousers}/>}   
        {step === 8 && <CheckoutPage handlePrev={handlePrevStep}/>}
        {step > 2 && step < 8 &&
        <div className='flex justify-between items-center mr-14 fixed bottom-0 pt-2 pb-2 md:pb-7 w-full px-3 md:px-7 z-[99999999] bg-charcoal text-beige md:text-charcoal md:bg-transparent'>
            <div onClick={handlePrevStep}>
            <svg width="50" height="37" viewBox="0 0 50 37" fill="none" xmlns="http://www.w3.org/2000/svg" className={`ml-4 w-7 rotate-180 ${step === 2 ? 'stroke-beige' : 'stroke-beige md:stroke-charcoal'}`}>
                <path d="M31.25 0.5C31.25 0.5 34.3071 18.5 50 18.5" stroke-width="2" stroke-miterlimit="10"/>
                <path d="M31.25 36.5C31.25 36.5 34.3071 18.5 50 18.5" stroke-width="2" stroke-miterlimit="10"/>
                <path d="M50 18.5L0 18.5" stroke-width="2" stroke-miterlimit="10"/>
            </svg>
            </div>
            <ButtonClick click={handleNextStep} mainColour='text-beige md:text-charcoal' text='Next step' icon='#2F2727' />
        </div>
        }
        </>
    )
}
