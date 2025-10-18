use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // Pastikan file welcome.blade.php ada di resources/views
});
