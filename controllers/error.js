exports.get404ErrorPage = (req, res, next) => {
    res.status(404).render("error/404", {
        pageTitle: "404 - Page Not Found",
        path: "/404"
    });
}
