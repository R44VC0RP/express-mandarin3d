import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { GetColorName } from 'hex-color-to-color-name';
import Footer from '../components/Footer';
import BackgroundEffects from '../components/BackgroundEffects';
import { Textarea } from '../components/ui/textarea';
import { UploadButton } from "../utils/uploadthing";
import axios from 'axios';
import { toast } from 'sonner';
import { FaArrowLeft, FaLongArrowAltRight, FaKeyboard } from 'react-icons/fa';
import { AnimatedProgressBar } from '../components/progressbar';
import { BlockPicker, CirclePicker } from 'react-color';
import CustomProductForm from './CustomProduct';

export const nameplateFormConfig = {
  formId: 'custom-nameplate-order',
  title: 'Custom Nameplate Order',
  description: 'Design your personalized nameplate with our easy-to-use form.',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Name on Nameplate',
      description: 'This is the name that will be printed on the nameplate',
      placeholder: 'Enter the name for your nameplate',
      required: true,
      validation: {
        minLength: 1,
        maxLength: 50,
      },
      image: 'https://utfs.io/f/RSbfEU0J8Dcdghlwk2z7mrUJN4RjMIfLonltvPdb2hcgHWaX'
    },
    {
      id: 'email',
      type: 'text',
      label: 'Email Address',
      description: 'This is the email address that will be used to contact you about your nameplate',
      placeholder: 'Enter your email address',
      required: true,
      validation: {
        minLength: 1,
        maxLength: 50,
      },
      image: 'https://utfs.io/f/RSbfEU0J8Dcdghlwk2z7mrUJN4RjMIfLonltvPdb2hcgHWaX'
    },
    {
      id: 'nameColor',
      type: 'color',
      label: 'Primary Color',
      description: 'This is the color of the name on the nameplate',
      required: true,
      image: 'https://utfs.io/f/RSbfEU0J8DcdNTtDtS0GsbMUTarVknIYg9e01AyOPdqHoplz'
    },
    {
      id: 'backgroundColor',
      type: 'color',
      label: 'Background Color',
      description: 'This is the color of the background of the nameplate',
      required: true,
      image: 'https://utfs.io/f/RSbfEU0J8DcddEkdfs6eQnPwkd8avsX0M79BxA2IRlWrOz3j'
    },
    {
      id: 'font',
      type: 'select',
      label: 'Font Style',
      description: 'If you do not see a font you like, you can request one in the notes section on the review page (we more than likely have it)',
      required: true,
      options: [
        { value: 'Arial', label: 'Arial' },
        { value: 'Times New Roman', label: 'Times New Roman' },
        { value: 'Inter', label: 'Inter' },
        { value: 'Bebas Neue', label: 'Bebas Neue' }
      ],
      image: 'https://utfs.io/f/RSbfEU0J8DcdeaY2yR9Ag5PLTzy2EhmoORd1Y9FnvDQVBfrt'
    },
    {
      id: 'logo',
      type: 'custom',
      label: 'Custom Logo (Optional)',
      description: 'This is the logo that will be printed on the nameplate, it must be a .svg file',
      required: false,
      image: 'https://utfs.io/f/RSbfEU0J8DcdSZ7UFpDtX7RAid92cDgZWrxQUS6uIBPLobTm'
    },
    {
      id: 'notes',
      type: 'notes',
      label: 'Additional Notes',
      description: 'Please add any special instructions for your nameplate here, this can include things like font size, font weight, etc. You will be able to review your nameplate before it is printed.',
      image: 'https://utfs.io/f/RSbfEU0J8Dcdghlwk2z7mrUJN4RjMIfLonltvPdb2hcgHWaX'
    }
  ],
  submitButton: {
    text: 'Place Order',
    action: '/api/submit-nameplate-order'
  },
  onSubmitSuccess: {
    message: 'Your custom nameplate order has been successfully submitted!',
    redirect: '/order-confirmation'
  }
};

function CustomNameplateForm() {
  return <CustomProductForm formConfig={nameplateFormConfig} />;
}


export default CustomNameplateForm;