namespace AppGeoPortal.Middleware.Models
{
    public class LoginRequestModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool RefrescarToken { get; set; }
    }
}
