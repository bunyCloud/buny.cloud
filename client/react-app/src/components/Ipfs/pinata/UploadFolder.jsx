const axios = require('axios');
const fs = require('graceful-fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');

const pinataKey = '5736fef0dda5cb680674';
const pinataSecret = 'e40e3aaa580cec1a15c485c0f384fd12e554da3a642c3ff6fadb9ce5d73ae00f';

export const pinFolder = async (path, options = {}) => {



    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
