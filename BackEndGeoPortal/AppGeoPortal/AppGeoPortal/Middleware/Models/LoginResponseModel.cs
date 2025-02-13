namespace AppGeoPortal.Middleware.Models
{
    public class LoginResponseModel
    {
        public string Username { get; set; }
        public string AccessToken { get; set; }
        public int ExpireIn { get; set; }
    }
}
