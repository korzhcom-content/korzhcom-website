    $(() => {
        $("body").on("click", "a[slow-loading]", function () {
            showLoadIndicator();
        })
    });
    