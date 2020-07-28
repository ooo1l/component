<template>
    <div>
        <img />
    </div>
</template><script>
export default {
    el: '#example',
    data: {
        message: 'hello'
    },
    computed: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('')
        }
    }
}
</script><style>

</style>