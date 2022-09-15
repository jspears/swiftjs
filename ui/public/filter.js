

const filter = (inputNode) => {
    inputNode.addEventListener('change', (e) => {
        const v = e.target.value
        const re = new RegExp(v.replace(/[.]/g, '[.]').replace(/[*]/g, '.+?'));
        document.querySelectorAll('.code').forEach(node => {
            if (v == '' || re.test(node.innerText)) {
                node.style.display = 'unset'
            } else {
                node.style.display = 'none';
            }
        })
    })
};
filter(document.querySelector('#filter'));